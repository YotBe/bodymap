interface Props {
  num: string;
  label: string;
}

export function PaneEyebrow({ num, label }: Props) {
  return (
    <div className="pane-eyebrow">
      <span className="eb-num">{num}</span>
      <span className="eb-text">{label}</span>
    </div>
  );
}
