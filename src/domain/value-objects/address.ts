export class Address {
  private readonly street: string;
  private readonly city: string;
  private readonly state: string;
  private readonly zipCode: string;
  private readonly country: string;

  constructor(
    street: string,
    city: string,
    state: string,
    zipCode: string,
    country: string
  ) {
    if (!street?.trim()) throw new Error('Street is required');
    if (!city?.trim()) throw new Error('City is required');
    if (!state?.trim()) throw new Error('State is required');
    if (!zipCode?.trim()) throw new Error('Zip code is required');
    if (!country?.trim()) throw new Error('Country is required');

    this.street = street.trim();
    this.city = city.trim();
    this.state = state.trim();
    this.zipCode = zipCode.trim();
    this.country = country.trim();
  }

  public getStreet(): string {
    return this.street;
  }

  public getCity(): string {
    return this.city;
  }

  public getState(): string {
    return this.state;
  }

  public getZipCode(): string {
    return this.zipCode;
  }

  public getCountry(): string {
    return this.country;
  }

  public getFullAddress(): string {
    return `${this.street}, ${this.city}, ${this.state} ${this.zipCode}, ${this.country}`;
  }

  public equals(other: Address): boolean {
    return (
      this.street === other.street &&
      this.city === other.city &&
      this.state === other.state &&
      this.zipCode === other.zipCode &&
      this.country === other.country
    );
  }

  public toString(): string {
    return this.getFullAddress();
  }
}
