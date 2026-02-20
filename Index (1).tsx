import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import PersonForm from "@/components/PersonForm";
import RecordsTable from "@/components/RecordsTable";
import { Users, Shield, Activity } from "lucide-react";

interface Record {
  id: string;
  display_id: number;
  name: string;
  id_number: string;
  email: string;
  phone: string;
  created_at: string;
}

const Index = () => {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [editRecord, setEditRecord] = useState<Record | null>(null);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("personal_details")
      .select("*")
      .order("display_id", { ascending: true });
    if (!error && data) setRecords(data as Record[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleEdit = (record: Record) => {
    setEditRecord(record);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-hero)" }}>
      {/* Top nav bar */}
      <header className="border-b border-border/50 bg-card/40 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/25">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground leading-none">
                Personal <span className="text-gradient">DataBase</span>
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">Records Management System</p>
            </div>
          </div>

          {/* Stats pills */}
          <div className="hidden sm:flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/60 border border-border text-xs text-muted-foreground">
              <Users className="w-3.5 h-3.5 text-primary" />
              <span><strong className="text-foreground">{records.length}</strong> Records</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs">
              <Activity className="w-3.5 h-3.5 text-primary" />
              <span className="text-primary font-medium">Live</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Page title */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            {editRecord ? "Edit Record" : "Dashboard"}
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {editRecord
              ? "Update the information for this record"
              : "Manage and store personal details securely"}
          </p>
        </div>

        {/* Form */}
        <PersonForm
          key={editRecord?.id ?? "new"}
          editRecord={editRecord}
          onSaved={() => {
            fetchRecords();
            setEditRecord(null);
          }}
          onCancelEdit={() => setEditRecord(null)}
        />

        {/* Table */}
        <RecordsTable
          records={records}
          loading={loading}
          onEdit={handleEdit}
          onDeleted={fetchRecords}
        />

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground/40 mt-8 pb-4">
          Personal DataBase · Built with Lovable Cloud
        </p>
      </main>
    </div>
  );
};

export default Index;
