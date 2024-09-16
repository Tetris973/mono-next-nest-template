export class RecordNotFoundException extends Error {
  override name = 'RecordNotFoundException' as const;
  public readonly model: string;
  public readonly id: string | number;

  constructor(model: string, id: string | number) {
    super(`${model} with id ${id} not found`);
    this.model = model;
    this.id = id;
  }
}
