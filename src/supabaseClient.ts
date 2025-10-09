import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jifjjzaofphtebzdwicy.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppZmpqemFvZnBodGViemR3aWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MDcyMDYsImV4cCI6MjA3NTQ4MzIwNn0.3sf39ZfQvbvexKe9euBWG5zdHheQFR5744DgmVCMqdE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
