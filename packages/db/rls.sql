-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenancies ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view profiles of landlords they interact with" ON users
  FOR SELECT USING (
    role = 'landlord' AND (
      -- Users can see landlords of properties they have offers on
      id IN (
        SELECT DISTINCT landlord_id FROM offers 
        WHERE tenant_id = auth.uid()
      )
      OR
      -- Users can see landlords they have messages with
      id IN (
        SELECT DISTINCT sender_id FROM messages 
        WHERE recipient_id = auth.uid()
      )
      OR
      id IN (
        SELECT DISTINCT recipient_id FROM messages 
        WHERE sender_id = auth.uid()
      )
    )
  );

-- Properties table policies
CREATE POLICY "Landlords can manage their own properties" ON properties
  FOR ALL USING (landlord_id = auth.uid());

CREATE POLICY "Anyone can view properties with active listings" ON properties
  FOR SELECT USING (
    id IN (
      SELECT DISTINCT property_id FROM listings 
      WHERE is_active = true
    )
  );

-- Listings table policies
CREATE POLICY "Landlords can manage their own listings" ON listings
  FOR ALL USING (landlord_id = auth.uid());

CREATE POLICY "Anyone can view active listings" ON listings
  FOR SELECT USING (is_active = true);

-- Offers table policies
CREATE POLICY "Tenants can manage their own offers" ON offers
  FOR ALL USING (tenant_id = auth.uid());

CREATE POLICY "Landlords can view and manage offers on their properties" ON offers
  FOR ALL USING (landlord_id = auth.uid());

-- Tenancies table policies
CREATE POLICY "Landlords can view and manage their tenancies" ON tenancies
  FOR ALL USING (landlord_id = auth.uid());

CREATE POLICY "Tenants can view their own tenancies" ON tenancies
  FOR SELECT USING (tenant_id = auth.uid());

CREATE POLICY "Tenants can update their payment status" ON tenancies
  FOR UPDATE USING (tenant_id = auth.uid());

-- Messages table policies
CREATE POLICY "Users can view messages they sent or received" ON messages
  FOR SELECT USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update read status of messages they received" ON messages
  FOR UPDATE USING (recipient_id = auth.uid());

-- Payments table policies
CREATE POLICY "Landlords can view and manage payments for their properties" ON payments
  FOR ALL USING (landlord_id = auth.uid());

CREATE POLICY "Tenants can view their own payments" ON payments
  FOR SELECT USING (tenant_id = auth.uid());

CREATE POLICY "Tenants can update their payment information" ON payments
  FOR UPDATE USING (tenant_id = auth.uid());

-- Additional helper functions for RLS

-- Function to check if user is landlord
CREATE OR REPLACE FUNCTION is_landlord()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT role = 'landlord' 
    FROM users 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is tenant
CREATE OR REPLACE FUNCTION is_tenant()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT role = 'tenant' 
    FROM users 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can access property
CREATE OR REPLACE FUNCTION can_access_property(property_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    -- Landlord owns the property
    (SELECT landlord_id FROM properties WHERE id = property_uuid) = auth.uid()
    OR
    -- Tenant has an offer on a listing for this property
    EXISTS (
      SELECT 1 FROM offers o
      JOIN listings l ON o.listing_id = l.id
      WHERE l.property_id = property_uuid AND o.tenant_id = auth.uid()
    )
    OR
    -- Tenant has an active tenancy for this property
    EXISTS (
      SELECT 1 FROM tenancies
      WHERE property_id = property_uuid AND tenant_id = auth.uid()
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to automatically create message thread ID
CREATE OR REPLACE FUNCTION generate_thread_id(sender UUID, recipient UUID)
RETURNS UUID AS $$
BEGIN
  -- Create consistent thread ID regardless of sender/recipient order
  IF sender < recipient THEN
    RETURN uuid_generate_v5(uuid_ns_url(), sender::text || recipient::text);
  ELSE
    RETURN uuid_generate_v5(uuid_ns_url(), recipient::text || sender::text);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to increment listing views
CREATE OR REPLACE FUNCTION increment_listing_views(listing_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE listings 
  SET views_count = views_count + 1 
  WHERE id = listing_uuid AND is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;