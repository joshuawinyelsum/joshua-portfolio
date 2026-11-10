interface MetadataItemProps {
  label: string;
  value: string;
  /** Use inside an onyx surface. */
  onInverse?: boolean;
}

export function MetadataItem({ label, value, onInverse = false }: MetadataItemProps) {
  return (
    <div>
      <dt className={`text-eyebrow font-semibold uppercase ${onInverse ? 'text-on-inverse-muted' : 'text-ink-muted'}`}>
        {label}
      </dt>
      <dd className={`mt-1.5 text-body font-medium ${onInverse ? 'text-on-inverse' : 'text-ink'}`}>{value}</dd>
    </div>
  );
}
