export abstract class Entity<TProps extends { id: string }> {
  protected constructor(protected readonly props: TProps) {}

  get id(): string {
    return this.props.id;
  }

  equals(other: Entity<TProps> | null | undefined): boolean {
    if (!other) return false;
    return this.id === other.id;
  }

  toObject(): TProps {
    return { ...this.props };
  }
}