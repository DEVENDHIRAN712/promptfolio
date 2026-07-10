import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Award, Plus, Trash2, ExternalLink, Calendar, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
      <Card className="border-slate-800/80 bg-slate-900/60 backdrop-blur">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-400" /> Licenses &amp; Professional Certifications
            </CardTitle>
            <CardDescription>
              List recognized industry achievements, AWS certifications, and bootcamp completions
            </CardDescription>
          </div>
          {!isAdding && (
            <Button
              onClick={() => {
                setFormData(initialFormState);
                setIsAdding(true);
              }}
              size="sm"
              className="bg-blue-600 hover:bg-blue-500 font-semibold text-xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Certificate
            </Button>
          )}
        </CardHeader>

        {isAdding && (
          <CardContent className="border-t border-slate-800/80 pt-4 bg-slate-950/40">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addMutation.mutate(formData);
              }}
              className="space-y-4"
            >
              <h4 className="text-sm font-bold text-white">Add Professional Certificate</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="certTitle">Certificate / License Name</Label>
                  <Input
                    id="certTitle"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="AWS Certified Solutions Architect – Associate"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="issuer">Issuing Organization</Label>
                  <Input
                    id="issuer"
                    required
                    value={formData.issuer}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    placeholder="Amazon Web Services (AWS) / Coursera"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="issueDate">Issue Date</Label>
                  <Input
                    id="issueDate"
                    type="month"
                    required
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="expiryDate">Expiration Date (if applicable)</Label>
                  <Input
                    id="expiryDate"
                    type="month"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="credentialId">Credential ID / License Number</Label>
                  <Input
                    id="credentialId"
                    value={formData.credentialId}
                    onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                    placeholder="AWS-12345678"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="credentialUrl">Credential Verification URL</Label>
                  <Input
                    id="credentialUrl"
                    value={formData.credentialUrl}
                    onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                    placeholder="https://credly.com/badges/..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={addMutation.isPending} className="bg-blue-600 hover:bg-blue-500">
                  {addMutation.isPending ? 'Saving...' : 'Save Certificate'}
                </Button>
              </div>
            </form>
          </CardContent>
        )}

        <CardContent className="pt-2 space-y-4">
          {certificates.length === 0 && !isAdding ? (
            <div className="text-center py-8 text-slate-500 border border-dashed border-slate-800 rounded-xl">
              <p className="text-sm">No professional certificates added yet.</p>
              <p className="text-xs text-slate-600 mt-1">Add your AWS, Google, or industry certifications above.</p>
            </div>
          ) : (
            certificates.map((cert) => (
              <div
                key={cert._id}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-white">{cert.title}</h4>
                    <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] uppercase">
                      Verified
                    </Badge>
                  </div>
                  <p className="text-sm font-semibold text-slate-300">{cert.issuer}</p>
                  <p className="text-xs text-slate-500 font-mono flex items-center gap-2">
                    <span>Issued: {cert.issueDate}</span>
                    {cert.expiryDate && <span>&bull; Expires: {cert.expiryDate}</span>}
                    {cert.credentialId && <span>&bull; ID: {cert.credentialId}</span>}
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-400 hover:underline"
                    >
                      Verify <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (confirm(`Delete certificate "${cert.title}"?`)) {
                        deleteMutation.mutate(cert._id);
                      }
                    }}
                    className="h-8 w-8 p-0 text-slate-400 hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CertificatesSection;
