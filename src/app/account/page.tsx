
'use client';

import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import { LogOut, User, Settings, Shield } from 'lucide-react';
import GithubExportDialog from '@/components/github-export-dialog';
import { Separator } from '@/components/ui/separator';

export default function AccountPage() {
  const { setAppMode } = useAppContext();

  const handleSwitchApp = () => {
    setAppMode(null);
  };

  return (
    <div className="flex flex-col items-center h-full px-4 py-8">
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center mb-4">
          <User className="w-12 h-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold mb-1">Account</h2>
        <p className="text-muted-foreground">Manage your settings and data.</p>
      </div>

      <div className="w-full space-y-6">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Developer Tools
          </h3>
          <GithubExportDialog />
          <p className="text-xs text-muted-foreground px-1 flex items-start gap-1">
            <Shield className="h-3 w-3 mt-0.5 text-primary shrink-0" />
            Backs up all source files, documentation (PRDs), and configurations to your personal GitHub repository.
          </p>
        </div>

        <Separator />

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Application
          </h3>
          <Button variant="outline" className="w-full justify-start" onClick={handleSwitchApp}>
            <LogOut className="mr-2 h-4 w-4" />
            Switch Application Mode
          </Button>
        </div>
      </div>
    </div>
  );
}
