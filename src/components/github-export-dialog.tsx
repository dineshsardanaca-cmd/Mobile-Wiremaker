'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Github, Loader2, ShieldCheck, ExternalLink, Info } from 'lucide-react';
import { pushFullAppToGitHub } from '@/app/actions/github-export';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function GithubExportDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [token, setToken] = useState('');
  const [repo, setRepo] = useState('');
  const [branch, setBranch] = useState('main');

  const handleExport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await pushFullAppToGitHub(token, repo, branch);
      toast({
        title: "Backup Complete",
        description: `Successfully backed up ${result.count} files to GitHub.`,
      });
      setIsOpen(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Backup Failed",
        description: error.message || "An error occurred while backing up to GitHub.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Github className="mr-2 h-4 w-4" />
          Full App Backup to GitHub
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] max-h-[90vh] overflow-y-auto" container={document.getElementById('mobile-app-frame')}>
        <form onSubmit={handleExport}>
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-primary" />
                GitHub Full Backup
            </DialogTitle>
            <DialogDescription>
              This will sync all source code, PRDs, and config files to your repository.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <Alert className="bg-accent/50 border-none py-2 px-3">
              <Info className="h-4 w-4" />
              <AlertTitle className="text-xs font-bold mb-1">Permission Requirements</AlertTitle>
              <AlertDescription className="text-[11px] leading-tight space-y-1">
                <p>1. Create a <strong>Personal Access Token</strong>:</p>
                <ul className="list-disc pl-4 space-y-0.5">
                  <li><strong>Classic:</strong> Check the <code>'repo'</code> scope.</li>
                  <li><strong>Fine-grained:</strong> Set <code>'Contents'</code> to <strong>Read & Write</strong>.</li>
                </ul>
                <p>2. Create a <strong>new repository</strong> on GitHub first.</p>
                <p>3. Path format: <code>username/repo-name</code>.</p>
              </AlertDescription>
            </Alert>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="token" className="text-xs">Personal Access Token</Label>
                <a 
                  href="https://github.com/settings/tokens/new" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[10px] text-primary flex items-center gap-0.5 hover:underline"
                >
                  Create Token <ExternalLink className="h-2 w-2" />
                </a>
              </div>
              <Input
                id="token"
                type="password"
                placeholder="ghp_xxxxxxxxxxxx"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
                className="h-9 text-sm"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="repo" className="text-xs">Target Repository (owner/repo)</Label>
              <Input
                id="repo"
                placeholder="username/my-menu-backup"
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                required
                className="h-9 text-sm"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="branch" className="text-xs">Branch</Label>
              <Input
                id="branch"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                required
                className="h-9 text-sm"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isLoading} className="w-full h-11">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading Files...
                </>
              ) : (
                'Start Full Backup'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
