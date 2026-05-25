import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { LogOut, Search, Download, Trash2, MessageSquare, Pencil } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Lead = Tables<"leads">;
type ChatSession = Tables<"chat_sessions">;
type ChatMessage = Tables<"chat_messages">;
type LeadStatus = "new" | "contacted" | "booked" | "closed";

const STATUS_COLORS: Record<LeadStatus, string> = {
  new: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
  contacted: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  booked: "bg-primary/15 text-primary border-primary/30",
  closed: "bg-muted text-muted-foreground border-border",
};

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md glass-card border-border">
        <CardHeader className="text-center">
          <CardTitle className="font-display text-2xl text-gradient">Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function LeadEditDialog({ lead, onSaved }: { lead: Lead; onSaved: (l: Lead) => void }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<LeadStatus>(lead.status as LeadStatus);
  const [notes, setNotes] = useState(lead.admin_notes ?? "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const { data, error } = await supabase
      .from("leads")
      .update({ status, admin_notes: notes || null })
      .eq("id", lead.id)
      .select()
      .single();
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Lead updated");
    onSaved(data as Lead);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm"><Pencil className="h-4 w-4" /></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{lead.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground space-y-1">
            <p>{lead.email}{lead.phone && ` · ${lead.phone}`}</p>
            <p>Preferred: {format(new Date(lead.preferred_date), "MMM d, yyyy")}</p>
            <p className="pt-2 text-foreground">{lead.project_description}</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select value={status} onValueChange={(v) => setStatus(v as LeadStatus)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="booked">Booked</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Private notes</label>
            <Textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Internal notes about this lead…"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function exportLeadsCSV(leads: Lead[]) {
  const headers = ["Name", "Email", "Phone", "Project", "Preferred Date", "Status", "Notes", "Submitted"];
  const escape = (v: string) => `"${(v ?? "").replace(/"/g, '""')}"`;
  const rows = leads.map((l) =>
    [
      l.name, l.email, l.phone ?? "", l.project_description,
      l.preferred_date, l.status, l.admin_notes ?? "",
      l.created_at,
    ].map(escape).join(",")
  );
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `leads-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function LeadsTab() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchLeads = async () => {
    const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    setLeads((data as Lead[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchLeads(); }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return leads.filter((l) => {
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (!q) return true;
      return (
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        (l.phone ?? "").toLowerCase().includes(q) ||
        l.project_description.toLowerCase().includes(q)
      );
    });
  }, [leads, query, statusFilter]);

  const deleteLead = async (id: string) => {
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Lead deleted");
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  const upcoming = leads.filter((l) => new Date(l.preferred_date) >= new Date()).length;
  const thisMonth = leads.filter((l) => {
    const d = new Date(l.created_at); const n = new Date();
    return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
  }).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="glass-card"><CardContent className="pt-6 text-center">
          <p className="text-3xl font-bold">{leads.length}</p>
          <p className="text-sm text-muted-foreground">Total Leads</p>
        </CardContent></Card>
        <Card className="glass-card"><CardContent className="pt-6 text-center">
          <p className="text-3xl font-bold">{upcoming}</p>
          <p className="text-sm text-muted-foreground">Upcoming Bookings</p>
        </CardContent></Card>
        <Card className="glass-card"><CardContent className="pt-6 text-center">
          <p className="text-3xl font-bold">{thisMonth}</p>
          <p className="text-sm text-muted-foreground">This Month</p>
        </CardContent></Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search name, email, project…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="sm:w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="booked">Booked</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={() => exportLeadsCSV(filtered)} disabled={!filtered.length}>
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground">Loading…</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-muted-foreground">No leads match.</p>
      ) : (
        <div className="rounded-xl border border-border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Preferred</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">
                    {lead.name}
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(lead.created_at), "MMM d")}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    <div>{lead.email}</div>
                    {lead.phone && <div className="text-muted-foreground">{lead.phone}</div>}
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate text-sm" title={lead.project_description}>{lead.project_description}</div>
                    {lead.admin_notes && <div className="text-xs text-muted-foreground truncate" title={lead.admin_notes}>📝 {lead.admin_notes}</div>}
                  </TableCell>
                  <TableCell className="text-sm">{format(new Date(lead.preferred_date), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={STATUS_COLORS[lead.status as LeadStatus]}>
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <LeadEditDialog
                      lead={lead}
                      onSaved={(updated) => setLeads((prev) => prev.map((l) => l.id === updated.id ? updated : l))}
                    />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this lead?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently remove {lead.name}'s submission.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteLead(lead.id)} className="bg-destructive">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function ConversationsTab() {
  const [sessions, setSessions] = useState<(ChatSession & { msg_count: number; preview: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    (async () => {
      const { data: sess } = await supabase
        .from("chat_sessions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      const { data: msgs } = await supabase
        .from("chat_messages")
        .select("session_id, content, role, created_at")
        .order("created_at", { ascending: true });
      const byId = new Map<string, { count: number; preview: string }>();
      (msgs || []).forEach((m: any) => {
        const cur = byId.get(m.session_id) || { count: 0, preview: "" };
        cur.count += 1;
        if (!cur.preview && m.role === "user") cur.preview = m.content;
        byId.set(m.session_id, cur);
      });
      setSessions(((sess as ChatSession[]) || []).map((s) => ({
        ...s,
        msg_count: byId.get(s.id)?.count || 0,
        preview: byId.get(s.id)?.preview || "(no messages)",
      })));
      setLoading(false);
    })();
  }, []);

  const openSession = async (id: string) => {
    setActiveId(id);
    const { data } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("session_id", id)
      .order("created_at", { ascending: true });
    setMessages((data as ChatMessage[]) || []);
  };

  const deleteSession = async (id: string) => {
    const { error } = await supabase.from("chat_sessions").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Conversation deleted");
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (activeId === id) { setActiveId(null); setMessages([]); }
  };

  if (loading) return <p className="text-center text-muted-foreground">Loading…</p>;
  if (sessions.length === 0) return <p className="text-center text-muted-foreground">No conversations yet.</p>;

  return (
    <div className="grid md:grid-cols-[320px_1fr] gap-4">
      <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
        {sessions.map((s) => (
          <button
            key={s.id}
            onClick={() => openSession(s.id)}
            className={`w-full text-left rounded-lg border p-3 transition-colors ${
              activeId === s.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/30"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground">
                {format(new Date(s.created_at), "MMM d, h:mm a")}
              </span>
              <Badge variant="outline" className="text-[10px]">{s.msg_count} msg</Badge>
            </div>
            <p className="text-sm text-foreground mt-1 line-clamp-2">{s.preview}</p>
          </button>
        ))}
      </div>

      <Card className="glass-card min-h-[400px]">
        {!activeId ? (
          <CardContent className="flex h-full items-center justify-center text-muted-foreground p-12">
            <div className="text-center">
              <MessageSquare className="mx-auto h-8 w-8 mb-2 opacity-50" />
              <p>Select a conversation</p>
            </div>
          </CardContent>
        ) : (
          <>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border">
              <CardTitle className="text-base">Transcript</CardTitle>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete conversation?</AlertDialogTitle>
                    <AlertDialogDescription>All messages will be removed.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteSession(activeId)} className="bg-destructive">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardHeader>
            <CardContent className="space-y-3 py-4 max-h-[65vh] overflow-y-auto">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                    m.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                  }`} style={{ whiteSpace: "pre-line" }}>
                    {m.content}
                  </div>
                </div>
              ))}
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <h1 className="font-display text-xl font-bold text-gradient">Admin Dashboard</h1>
        <Button variant="ghost" size="sm" onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" /> Sign Out
        </Button>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="leads" className="space-y-6">
          <TabsList>
            <TabsTrigger value="leads">Leads & Bookings</TabsTrigger>
            <TabsTrigger value="chats">Conversations</TabsTrigger>
          </TabsList>
          <TabsContent value="leads"><LeadsTab /></TabsContent>
          <TabsContent value="chats"><ConversationsTab /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default function Admin() {
  const [session, setSession] = useState<any>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setChecking(false);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setChecking(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  if (checking) return null;
  return session ? <Dashboard onLogout={handleLogout} /> : <LoginForm />;
}
