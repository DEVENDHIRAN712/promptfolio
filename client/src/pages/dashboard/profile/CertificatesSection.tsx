import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Award, Plus, Trash2, ExternalLink, Calendar, CheckCircle2, ShieldCheck, X, Building, KeyRound } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import api from '@/lib/axios';

interface CertificatesSectionProps {
  certificates: any[];
}

export const CertificatesSection: React.FC<CertificatesSectionProps> = ({ certificates }) => {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);

  const initialFormState = {
    title: '',
    issuer: '',
    issueDate: '2024-01',
    expiryDate: '',
    credentialId: '',
    credentialUrl: '',
  };

  const [formData, setFormData] = useState(initialFormState);

  const addMutation = useMutation({
    mutationFn: async (data: typeof initialFormState) => {
      const res = await api.post('/profile/certificate', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['completeProfile'] });
      setIsAdding(false);
      setFormData(initialFormState);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/profile/certificate/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['completeProfile'] });
    },
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <Card variant="glass" className="border-border p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" /> Licenses &amp; Professional Certifications
          </CardTitle>
          <CardDescription>
            Showcase AWS credentials, specialized certifications, and bootcamp graduation diplomas
          </CardDescription>
        </div>

        {!isAdding && (
          <Button
            onClick={() => {
              setFormData(initialFormState);
              setIsAdding(true);
            }}
            variant="glow"
            size="sm"
            className="font-bold text-xs gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Certificate
          </Button>
        )}
      </Card>

      {/* Add New Certificate Drawer Card */}
      {isAdding && (
        <Card variant="glass" className="border-primary/60 bg-surface-2/90 shadow-glow-primary animate-in fade-in-50 duration-200">
          <CardHeader className="border-b border-border/80 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold text-foreground">Add Professional Credential</CardTitle>
                  <CardDescription className="text-[11px]">Enter certificate and verification details.</CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)} className="h-8 w-8 p-0">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              addMutation.mutate(formData);
            }}
          >
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="certTitle" className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-primary" /> Certificate / License Name
                  </Label>
                  <Input
                    id="certTitle"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="AWS Certified Solutions Architect – Associate"
                    className="h-10 text-sm font-semibold"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="issuer" className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-primary" /> Issuing Organization
                  </Label>
                  <Input
                    id="issuer"
                    required
                    value={formData.issuer}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    placeholder="Amazon Web Services (AWS), Coursera, Y Combinator"
                    className="h-10 text-sm font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="issueDate" className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-primary" /> Issue Date
                  </Label>
                  <Input
                    id="issueDate"
                    type="month"
                    required
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    className="h-10 text-xs font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="expiryDate" className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-primary" /> Expiration Date (Optional)
                  </Label>
                  <Input
                    id="expiryDate"
                    type="month"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="h-10 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="credentialId" className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-primary" /> Credential ID / License Number
                  </Label>
                  <Input
                    id="credentialId"
                    value={formData.credentialId}
                    onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                    placeholder="AWS-12345678-ABCD"
                    className="h-10 text-xs font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="credentialUrl" className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                    Verification URL (Credly / Certificate Link)
                  </Label>
                  <Input
                    id="credentialUrl"
                    value={formData.credentialUrl}
                    onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                    placeholder="https://credly.com/badges/..."
                    className="h-10 text-xs font-mono"
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="border-t border-border/80 pt-4 flex justify-end gap-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="glow" size="sm" isLoading={addMutation.isPending} className="font-bold px-6">
                Save Credential
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* Certificates List */}
      {certificates.length === 0 && !isAdding ? (
        <EmptyState
          icon={Award}
          title="No Professional Certifications Documented"
          description="You haven't listed any certificates or licenses yet. Add cloud certifications, specialized AI diplomas, or recognized courses to stand out."
          actionLabel="Add Credential"
          onAction={() => {
            setFormData(initialFormState);
            setIsAdding(true);
          }}
        />
      ) : (
        <div className="space-y-4">
          {certificates.map((cert) => (
            <Card
              key={cert._id}
              variant="interactive"
              className="p-5 border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-base font-black text-foreground">{cert.title}</h4>
                  <Badge variant="glass" className="text-[10px] font-mono px-2 py-0.2 uppercase flex items-center gap-1 text-purple-300 border-purple-500/40 bg-purple-500/10">
                    <ShieldCheck className="w-3 h-3 text-primary inline" /> Verified
                  </Badge>
                </div>
                <p className="text-sm font-bold text-primary flex items-center gap-1.5">
                  <Building className="w-4 h-4 shrink-0" />
                  <span>{cert.issuer}</span>
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground font-mono pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-primary" /> Issued: {cert.issueDate}
                  </span>
                  {cert.expiryDate && (
                    <span>&bull; Expires: {cert.expiryDate}</span>
                  )}
                  {cert.credentialId && (
                    <span className="bg-surface-2 px-2 py-0.5 rounded border border-border/80">
                      ID: {cert.credentialId}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 self-start sm:self-center shrink-0">
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20"
                  >
                    Verify Credential <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (confirm(`Remove certificate "${cert.title}"?`)) {
                      deleteMutation.mutate(cert._id);
                    }
                  }}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  title="Remove certificate"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CertificatesSection;
