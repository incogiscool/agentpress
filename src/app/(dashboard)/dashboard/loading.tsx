import { Header } from "@/components/typography";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// TODO: UPDATE THIS TO USE SHADCN LOADING STATE

export default function DashboardLoading() {
  return (
    <div>
      <Header title="Your Projects" description="Manage your projects here." />
      <div className="grid md:grid-cols-4 grid-cols-1 gap-4 mt-8">
        {[1, 2, 3, 4].map((item) => (
          <Card key={item} className="w-full animate-pulse">
            <CardHeader>
              <div className="h-6 w-3/4 mb-2 bg-muted rounded" />
              <div className="h-4 w-full bg-muted rounded" />
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-4 w-2/3 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
