
-- Create a schema for your application data
CREATE SCHEMA IF NOT EXISTS public;

-- Create the profiles table
CREATE TABLE public.profiles (
    id uuid REFERENCES auth.users ON DELETE CASCADE,
    full_name text,
    role text,
    company_name text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);



-- Create the merchants table
CREATE TABLE public.merchants (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    email text UNIQUE NOT NULL,
    status text DEFAULT 'pending',
    risk_level text DEFAULT 'low',
    business_type text,
    address text,
    phone text,
    contact_name text,
    monthly_volume numeric,
    join_date timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create the payment_methods table
CREATE TABLE public.payment_methods (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    type text NOT NULL,
    details jsonb,
    last4 text,
    brand text,
    is_active boolean DEFAULT TRUE,
    is_default boolean DEFAULT FALSE,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL, -- Assuming customer_id links to profiles
    merchant_id uuid REFERENCES public.merchants(id) ON DELETE SET NULL,
    amount numeric NOT NULL,
    currency text NOT NULL,
    status text DEFAULT 'pending',
    payment_method_id uuid REFERENCES public.payment_methods(id) ON DELETE SET NULL,
    description text,
    timestamp timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create the payment_links table
CREATE TABLE public.payment_links (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id uuid REFERENCES public.merchants(id) ON DELETE CASCADE,
    amount numeric NOT NULL,
    currency text NOT NULL,
    description text,
    expires_at timestamp with time zone,
    status text DEFAULT 'active',
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create the notifications table
CREATE TABLE public.notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    type text NOT NULL,
    title text,
    message text NOT NULL,
    data jsonb,
    read boolean DEFAULT FALSE,
    timestamp timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);



-- Create the customers table
CREATE TABLE public.customers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id uuid REFERENCES public.merchants(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text UNIQUE,
    phone text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create the audit_logs table
CREATE TABLE public.audit_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    action text NOT NULL,
    severity text DEFAULT 'info',
    details jsonb,
    ip_address text,
    timestamp timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create the analytics_events table
CREATE TABLE public.analytics_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name text NOT NULL,
    event_data jsonb,
    timestamp timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create the merchant_onboarding table
CREATE TABLE public.merchant_onboarding (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name text NOT NULL,
    contact_email text NOT NULL,
    status text DEFAULT 'pending',
    application_data jsonb,
    submitted_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchant_onboarding ENABLE ROW LEVEL SECURITY;

-- Create policies for public.profiles
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (TRUE);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Create policies for public.transactions
CREATE POLICY "Enable read access for all users" ON public.transactions FOR SELECT USING (TRUE);
CREATE POLICY "Enable insert for authenticated users only" ON public.transactions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON public.transactions FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON public.transactions FOR DELETE USING (auth.role() = 'authenticated');

-- Create policies for public.payment_methods
CREATE POLICY "Enable read access for all users" ON public.payment_methods FOR SELECT USING (TRUE);
CREATE POLICY "Enable insert for authenticated users only" ON public.payment_methods FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON public.payment_methods FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON public.payment_methods FOR DELETE USING (auth.role() = 'authenticated');

-- Create policies for public.payment_links
CREATE POLICY "Enable read access for all users" ON public.payment_links FOR SELECT USING (TRUE);
CREATE POLICY "Enable insert for authenticated users only" ON public.payment_links FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON public.payment_links FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON public.payment_links FOR DELETE USING (auth.role() = 'authenticated');

-- Create policies for public.notifications
CREATE POLICY "Enable read access for all users" ON public.notifications FOR SELECT USING (TRUE);
CREATE POLICY "Enable insert for authenticated users only" ON public.notifications FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON public.notifications FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON public.notifications FOR DELETE USING (auth.role() = 'authenticated');

-- Create policies for public.merchants
CREATE POLICY "Enable read access for all users" ON public.merchants FOR SELECT USING (TRUE);
CREATE POLICY "Enable insert for authenticated users only" ON public.merchants FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON public.merchants FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON public.merchants FOR DELETE USING (auth.role() = 'authenticated');

-- Create policies for public.customers
CREATE POLICY "Enable read access for all users" ON public.customers FOR SELECT USING (TRUE);
CREATE POLICY "Enable insert for authenticated users only" ON public.customers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON public.customers FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON public.customers FOR DELETE USING (auth.role() = 'authenticated');

-- Create policies for public.audit_logs
CREATE POLICY "Enable read access for all users" ON public.audit_logs FOR SELECT USING (TRUE);
CREATE POLICY "Enable insert for authenticated users only" ON public.audit_logs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON public.audit_logs FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON public.audit_logs FOR DELETE USING (auth.role() = 'authenticated');

-- Create policies for public.analytics_events
CREATE POLICY "Enable read access for all users" ON public.analytics_events FOR SELECT USING (TRUE);
CREATE POLICY "Enable insert for authenticated users only" ON public.analytics_events FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON public.analytics_events FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON public.analytics_events FOR DELETE USING (auth.role() = 'authenticated');

-- Create policies for public.merchant_onboarding
CREATE POLICY "Enable read access for all users" ON public.merchant_onboarding FOR SELECT USING (TRUE);
CREATE POLICY "Enable insert for authenticated users only" ON public.merchant_onboarding FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON public.merchant_onboarding FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON public.merchant_onboarding FOR DELETE USING (auth.role() = 'authenticated');
