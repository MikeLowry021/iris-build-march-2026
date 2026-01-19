import { useState } from 'react';
import { ReviewComment } from '@/lib/review-types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { MessageSquare, CheckCircle2, Send, Clock, Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CommentThreadProps {
  comments: ReviewComment[];
  onAddComment: (content: string, section?: string) => void;
  onResolveComment: (commentId: string) => void;
  section?: string;
  showAddForm?: boolean;
  readonly?: boolean;
}

export function CommentThread({
  comments,
  onAddComment,
  onResolveComment,
  section,
  showAddForm = true,
  readonly = false,
}: CommentThreadProps) {
  const [newComment, setNewComment] = useState('');
  const [filter, setFilter] = useState<'all' | 'unresolved' | 'resolved'>('all');

  const filteredComments = comments
    .filter(comment => !section || comment.section === section)
    .filter(comment => {
      if (filter === 'unresolved') return !comment.isResolved;
      if (filter === 'resolved') return comment.isResolved;
      return true;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const unresolvedCount = comments.filter(c => !c.isResolved).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment.trim(), section);
      setNewComment('');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-ZA', { day: '2-digit', month: 'short' });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-semibold">
              Comments
            </CardTitle>
            {unresolvedCount > 0 && (
              <Badge variant="secondary" className="bg-warning/10 text-warning">
                {unresolvedCount} unresolved
              </Badge>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Filter className="mr-1.5 h-3.5 w-3.5" />
                {filter === 'all' ? 'All' : filter === 'unresolved' ? 'Unresolved' : 'Resolved'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilter('all')}>All Comments</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('unresolved')}>Unresolved Only</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('resolved')}>Resolved Only</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Comment list */}
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {filteredComments.map(comment => (
            <div
              key={comment.id}
              className={cn(
                'rounded-lg border p-3 transition-colors',
                comment.isResolved 
                  ? 'border-success/30 bg-success/5' 
                  : 'border-border bg-card'
              )}
            >
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                    {getInitials(comment.author)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-foreground">
                      {comment.author}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(comment.createdAt)}
                    </span>
                    {comment.section && !section && (
                      <Badge variant="outline" className="text-xs py-0">
                        {comment.section}
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-foreground/90">
                    {comment.content}
                  </p>

                  {comment.isResolved ? (
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-success">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Resolved by {comment.resolvedBy}</span>
                    </div>
                  ) : !readonly && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 h-7 text-xs"
                      onClick={() => onResolveComment(comment.id)}
                    >
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Mark Resolved
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredComments.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <MessageSquare className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">No comments yet</p>
            </div>
          )}
        </div>

        {/* Add comment form */}
        {showAddForm && !readonly && (
          <form onSubmit={handleSubmit} className="space-y-2">
            <Textarea
              placeholder="Add a comment or observation..."
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              rows={2}
              className="resize-none"
            />
            <div className="flex justify-end">
              <Button type="submit" size="sm" disabled={!newComment.trim()}>
                <Send className="mr-1.5 h-3.5 w-3.5" />
                Add Comment
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
