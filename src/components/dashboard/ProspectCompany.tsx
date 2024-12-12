interface ProspectCompanyProps {
  name: string;
  website: string | null;
}

export const ProspectCompany = ({ name, website }: ProspectCompanyProps) => {
  return (
    <div>
      <div>{name}</div>
      {website && (
        <div className="text-sm text-muted-foreground">{website}</div>
      )}
    </div>
  );
};