
-- Roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Users can see their own roles; admins can see all
CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Grant admin to the specified user
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role FROM auth.users WHERE email = 'okikiayoyinusa@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Tighten leads policy: only admins can view leads
DROP POLICY IF EXISTS "Only authenticated users can view leads" ON public.leads;

CREATE POLICY "Only admins can view leads"
ON public.leads FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
