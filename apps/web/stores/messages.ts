import { defineStore } from 'pinia'
import type { Message, User } from '~/types'

export const useMessagesStore = defineStore('messages', () => {
  const messages = ref<Message[]>([])
  const currentThread = ref<Message[]>([])
  const threads = ref<{ [key: string]: Message[] }>({})
  const loading = ref(false)
  const supabase = useSupabaseClient()

  const fetchThreads = async () => {
    loading.value = true
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id
      
      // Get all messages where user is sender or recipient
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users!messages_sender_id_fkey (
            id, first_name, last_name, email, avatar_url
          )
        `)
        .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      // Group messages by thread_id
      const threadMap: { [key: string]: Message[] } = {}
      data?.forEach(message => {
        if (!threadMap[message.thread_id]) {
          threadMap[message.thread_id] = []
        }
        threadMap[message.thread_id].push(message)
      })
      
      threads.value = threadMap
      return { data: threadMap, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    } finally {
      loading.value = false
    }
  }

  const fetchThread = async (threadId: string) => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users!messages_sender_id_fkey (
            id, first_name, last_name, email, avatar_url
          )
        `)
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true })

      if (error) throw error
      
      currentThread.value = data || []
      
      // Mark messages as read
      const userId = (await supabase.auth.getUser()).data.user?.id
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('thread_id', threadId)
        .eq('recipient_id', userId)
        .eq('is_read', false)
      
      return { data: data || [], error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    } finally {
      loading.value = false
    }
  }

  const sendMessage = async (recipientId: string, content: string, threadId?: string) => {
    loading.value = true
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id
      
      // Generate thread ID if not provided
      let finalThreadId = threadId
      if (!finalThreadId) {
        // Create consistent thread ID based on user IDs
        const userIds = [userId, recipientId].sort()
        finalThreadId = `thread_${userIds[0]}_${userIds[1]}`
      }

      const { data, error } = await supabase
        .from('messages')
        .insert({
          thread_id: finalThreadId,
          sender_id: userId,
          recipient_id: recipientId,
          content,
          is_read: false
        })
        .select(`
          *,
          sender:users!messages_sender_id_fkey (
            id, first_name, last_name, email, avatar_url
          )
        `)
        .single()

      if (error) throw error
      
      // Add to current thread if it's the active one
      if (currentThread.value.length > 0 && currentThread.value[0].thread_id === finalThreadId) {
        currentThread.value.push(data)
      }
      
      // Update threads cache
      if (!threads.value[finalThreadId]) {
        threads.value[finalThreadId] = []
      }
      threads.value[finalThreadId].push(data)
      
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    } finally {
      loading.value = false
    }
  }

  const getThreadPreview = (threadId: string) => {
    const threadMessages = threads.value[threadId]
    if (!threadMessages || threadMessages.length === 0) return null
    
    const lastMessage = threadMessages[threadMessages.length - 1]
    const userId = (getCurrentUser()?.id)
    
    // Get the other participant
    const otherParticipant = lastMessage.sender_id === userId 
      ? threadMessages.find(m => m.sender_id !== userId)?.sender
      : lastMessage.sender
    
    return {
      threadId,
      lastMessage,
      otherParticipant,
      unreadCount: threadMessages.filter(m => !m.is_read && m.recipient_id === userId).length,
      messageCount: threadMessages.length
    }
  }

  const getThreadPreviews = () => {
    return computed(() => {
      return Object.keys(threads.value)
        .map(threadId => getThreadPreview(threadId))
        .filter(preview => preview !== null)
        .sort((a, b) => new Date(b!.lastMessage.created_at).getTime() - new Date(a!.lastMessage.created_at).getTime())
    })
  }

  const getUnreadCount = () => {
    return computed(() => {
      const userId = getCurrentUser()?.id
      return Object.values(threads.value)
        .flat()
        .filter(message => !message.is_read && message.recipient_id === userId)
        .length
    })
  }

  const getCurrentUser = () => {
    // This should be replaced with actual auth store user
    return { id: 'current-user-id' }
  }

  const startConversation = async (recipientId: string, initialMessage?: string) => {
    const userId = getCurrentUser()?.id
    const userIds = [userId, recipientId].sort()
    const threadId = `thread_${userIds[0]}_${userIds[1]}`
    
    if (initialMessage) {
      await sendMessage(recipientId, initialMessage, threadId)
    }
    
    return threadId
  }

  // Real-time subscription setup
  const subscribeToMessages = (threadId: string) => {
    return supabase
      .channel(`messages:${threadId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `thread_id=eq.${threadId}`
        },
        async (payload) => {
          // Fetch the complete message with sender info
          const { data, error } = await supabase
            .from('messages')
            .select(`
              *,
              sender:users!messages_sender_id_fkey (
                id, first_name, last_name, email, avatar_url
              )
            `)
            .eq('id', payload.new.id)
            .single()

          if (!error && data) {
            currentThread.value.push(data)
            
            // Update threads cache
            if (!threads.value[threadId]) {
              threads.value[threadId] = []
            }
            threads.value[threadId].push(data)
          }
        }
      )
      .subscribe()
  }

  const unsubscribeFromMessages = (threadId: string) => {
    supabase.removeChannel(`messages:${threadId}`)
  }

  return {
    messages: readonly(messages),
    currentThread: readonly(currentThread),
    threads: readonly(threads),
    loading: readonly(loading),
    fetchThreads,
    fetchThread,
    sendMessage,
    getThreadPreview,
    getThreadPreviews,
    getUnreadCount,
    startConversation,
    subscribeToMessages,
    unsubscribeFromMessages
  }
})