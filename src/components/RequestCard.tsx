import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Phone, User, FileText, CheckCircle2, XCircle, Pause } from "lucide-react";
import { VisitorRequest } from "@/utils/localStorage";
import { useNavigate } from "react-router-dom";

interface RequestCardProps {
  request: VisitorRequest;
  onStatusChange: (id: string, status: VisitorRequest['status']) => void;
}

const RequestCard = ({ request, onStatusChange }: RequestCardProps) => {
  const navigate = useNavigate();
  
  const getStatusColor = (status: VisitorRequest['status']) => {
    switch (status) {
      case 'approved': return 'bg-success text-success-foreground';
      case 'declined': return 'bg-destructive text-destructive-foreground';
      case 'hold': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            {request.visitorName}
          </CardTitle>
          <Badge className={getStatusColor(request.status)}>
            {request.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="h-4 w-4" />
          <span>{request.mobile}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{formatDate(request.createdAt)}</span>
        </div>

        <div className="flex items-start gap-2 text-sm">
          <FileText className="h-4 w-4 mt-0.5 text-muted-foreground" />
          <p className="text-muted-foreground">{request.reason}</p>
        </div>

        {request.status === 'pending' && (
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              variant="default"
              className="flex-1 bg-success hover:bg-success/90"
              onClick={() => onStatusChange(request.id, 'approved')}
            >
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => onStatusChange(request.id, 'hold')}
            >
              <Pause className="h-4 w-4 mr-1" />
              Hold
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="flex-1"
              onClick={() => onStatusChange(request.id, 'declined')}
            >
              <XCircle className="h-4 w-4 mr-1" />
              Decline
            </Button>
          </div>
        )}

        {request.status === 'approved' && (
          <Button
            size="sm"
            className="w-full mt-2"
            onClick={() => navigate(`/chat/${request.id}`)}
          >
            Open Chat
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default RequestCard;
