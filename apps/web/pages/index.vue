<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold mb-6">
            Find Your Perfect Home
          </h1>
          <p class="text-xl md:text-2xl mb-8 text-blue-100">
            Connect landlords and tenants in one modern platform
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink to="/listings" class="btn btn-primary text-lg px-8 py-3">
              Browse Properties
            </NuxtLink>
            <NuxtLink to="/auth/register" class="btn bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3">
              Get Started
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            Everything You Need
          </h2>
          <p class="text-lg text-gray-600">
            Streamline your property management and rental experience
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Landlord Features -->
          <div class="card">
            <div class="text-center">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <HomeIcon class="w-6 h-6 text-blue-600" />
              </div>
              <h3 class="text-xl font-semibold mb-2">For Landlords</h3>
              <p class="text-gray-600 mb-4">
                Manage properties, screen tenants, and collect rent online
              </p>
              <ul class="text-sm text-gray-500 space-y-1">
                <li>• Property listing management</li>
                <li>• Tenant screening & offers</li>
                <li>• Automated rent collection</li>
                <li>• Real-time messaging</li>
              </ul>
            </div>
          </div>

          <!-- Tenant Features -->
          <div class="card">
            <div class="text-center">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MagnifyingGlassIcon class="w-6 h-6 text-green-600" />
              </div>
              <h3 class="text-xl font-semibold mb-2">For Tenants</h3>
              <p class="text-gray-600 mb-4">
                Find perfect homes and manage your rental experience
              </p>
              <ul class="text-sm text-gray-500 space-y-1">
                <li>• Advanced property search</li>
                <li>• Direct landlord communication</li>
                <li>• Online rent payments</li>
                <li>• Offer management</li>
              </ul>
            </div>
          </div>

          <!-- Platform Features -->
          <div class="card">
            <div class="text-center">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon class="w-6 h-6 text-purple-600" />
              </div>
              <h3 class="text-xl font-semibold mb-2">Secure & Modern</h3>
              <p class="text-gray-600 mb-4">
                Built with security, performance, and user experience in mind
              </p>
              <ul class="text-sm text-gray-500 space-y-1">
                <li>• Secure payments via Stripe</li>
                <li>• Real-time notifications</li>
                <li>• Mobile-responsive design</li>
                <li>• Data protection & privacy</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-gray-50 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">
          Ready to Get Started?
        </h2>
        <p class="text-lg text-gray-600 mb-8">
          Join thousands of landlords and tenants using our platform
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink to="/auth/register?role=landlord" class="btn btn-primary text-lg px-8 py-3">
            I'm a Landlord
          </NuxtLink>
          <NuxtLink to="/auth/register?role=tenant" class="btn btn-secondary text-lg px-8 py-3">
            I'm a Tenant
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { HomeIcon, MagnifyingGlassIcon, ShieldCheckIcon } from '@heroicons/vue/24/outline'

// Set page meta
definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Real Estate Platform - Find Your Perfect Home',
  meta: [
    { name: 'description', content: 'Modern SaaS platform connecting landlords and tenants. Manage properties, screen tenants, collect rent, and find your perfect home.' }
  ]
})
</script>