
-- Create leads table for storing visitor inquiries and bookings
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  project_description TEXT NOT NULL,
  preferred_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public form)
CREATE POLICY "Anyone can submit a lead"
  ON public.leads
  FOR INSERT
  WITH CHECK (true);

-- Only authenticated admin can read leads (you)
CREATE POLICY "Only authenticated users can view leads"
  ON public.leads
  FOR SELECT
  USING (auth.uid() IS NOT NULL);
