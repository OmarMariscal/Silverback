export interface Mapper<DomainEntity, PrismaModel> {
  toDomain(raw: PrismaModel): DomainEntity;
  toPersistence(entity: DomainEntity): any;
}
