import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { updateLead, assignLead } from '@/store/slices/leadsSlice';
import { fetchActivities, createActivity } from '@/store/slices/activitiesSlice';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatusBadge from './StatusBadge';
import { Mail, Phone, Building2, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface LeadDetailsProps {
  leadId: string;
  isOpen: boolean;
  onClose: () => void;
}

const LeadDetails = ({ leadId, isOpen, onClose }: LeadDetailsProps) => {
  const dispatch = useDispatch();
  const lead = useSelector((state: RootState) =>
    state.leads.leads.find((l) => l.id === leadId)
  );
  const { activities, loading: activitiesLoading } = useSelector((state: RootState) => state.activities);
  const { users } = useSelector((state: RootState) => state.users);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [activityContent, setActivityContent] = useState('');
  const [activityType, setActivityType] = useState<'NOTE' | 'CALL' | 'MEETING'>('NOTE');

  useEffect(() => {
    if (leadId) {
      dispatch(fetchActivities(leadId) as any);
    }
  }, [dispatch, leadId]);

  if (!lead) return null;

  const handleStatusChange = (newStatus: string) => {
    dispatch(updateLead({ id: lead.id, status: newStatus }) as any);
  };

  const handleAssignLead = (userId: string) => {
    dispatch(assignLead({ id: lead.id, userId }) as any);
  };

  const handleAddActivity = async () => {
    if (!activityContent.trim()) return;
    
    await dispatch(
      createActivity({
        type: activityType,
        content: activityContent,
        leadId: lead.id,
      }) as any
    );
    
    setActivityContent('');
    setActivityType('NOTE');
  };

  const canEdit = user?.role === 'ADMIN' || user?.role === 'MANAGER' || lead.assignedToId === user?.id;
  const canAssign = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Lead Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{lead.name}</CardTitle>
                <StatusBadge status={lead.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{lead.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{lead.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span>{lead.company}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Value: </span>
                  <span className="font-semibold">${lead.value.toLocaleString()}</span>
                </div>
              </div>

              {canEdit && (
                <div className="space-y-4 pt-4 border-t">
                  <div>
                    <Label>Status</Label>
                    <Select value={lead.status} onValueChange={handleStatusChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NEW">New</SelectItem>
                        <SelectItem value="CONTACTED">Contacted</SelectItem>
                        <SelectItem value="QUALIFIED">Qualified</SelectItem>
                        <SelectItem value="PROPOSAL">Proposal</SelectItem>
                        <SelectItem value="WON">Won</SelectItem>
                        <SelectItem value="LOST">Lost</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {canAssign && (
                    <div>
                      <Label>Assign To</Label>
                      <Select
                        value={lead.assignedToId || ''}
                        onValueChange={handleAssignLead}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select user" />
                        </SelectTrigger>
                        <SelectContent>
                          {users
                            .filter((u) => u.role === 'SALES')
                            .map((u) => (
                              <SelectItem key={u.id} value={u.id}>
                                {u.name} ({u.email})
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Select value={activityType} onValueChange={(value: any) => setActivityType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NOTE">Note</SelectItem>
                      <SelectItem value="CALL">Call</SelectItem>
                      <SelectItem value="MEETING">Meeting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Textarea
                  placeholder="Add activity details..."
                  value={activityContent}
                  onChange={(e) => setActivityContent(e.target.value)}
                  rows={3}
                />
                <Button onClick={handleAddActivity} className="w-full">
                  Add Activity
                </Button>
              </div>

              <div className="space-y-3 pt-4 border-t">
                {activitiesLoading ? (
                  <p className="text-sm text-muted-foreground text-center">Loading activities...</p>
                ) : activities.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center">No activities yet</p>
                ) : (
                  activities.map((activity) => (
                    <div key={activity.id} className="p-3 bg-muted rounded-lg space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{activity.type}</span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {format(new Date(activity.createdAt), 'MMM d, yyyy h:mm a')}
                        </div>
                      </div>
                      <p className="text-sm">{activity.content}</p>
                      <p className="text-xs text-muted-foreground">by {activity.user.name}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeadDetails;
