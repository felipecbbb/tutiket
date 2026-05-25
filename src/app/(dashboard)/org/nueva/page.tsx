import { NewOrgForm } from "./new-org-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewOrgPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Nueva organización</CardTitle>
          <CardDescription>
            Empieza con lo esencial. Podrás completar el resto más adelante.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewOrgForm />
        </CardContent>
      </Card>
    </div>
  );
}
