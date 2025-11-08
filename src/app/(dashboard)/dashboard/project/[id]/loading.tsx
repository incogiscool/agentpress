import { Header } from "@/components/typography";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ProjectLoading() {
  return (
    <div className="container mx-auto py-8">
      <Header
        title="Project Methods"
        description="View and manage your API methods"
      />

      <div className="grid gap-4 mt-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Card key={item} className="w-full animate-pulse">
            <CardHeader>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-16 bg-muted rounded" />
                  <div className="h-6 w-32 bg-muted rounded" />
                </div>
                <div className="h-8 w-8 bg-muted rounded" />
              </div>
              <div className="h-4 w-full bg-muted rounded" />
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-4 w-3/4 bg-muted rounded" />
              <div className="h-20 w-full bg-muted rounded mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
