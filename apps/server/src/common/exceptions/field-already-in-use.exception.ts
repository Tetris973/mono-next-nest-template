class FieldAlreadyInUseException extends Error {
  constructor(fieldName: string, fieldValue: any) {
    const message = `${fieldName} ${fieldValue} is already in use.`;
    super(message);
    this.name = 'FieldAlreadyInUseException';
  }
}

export { FieldAlreadyInUseException };
