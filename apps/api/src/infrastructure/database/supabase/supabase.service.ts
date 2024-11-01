import { Injectable } from "@nestjs/common";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

@Injectable()
export class SupabaseService {
  readonly supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
  }
}
