export abstract class Failure {
    constructor(public message: string) { }
}

export class ServerFailure extends Failure { }
export class CacheFailure extends Failure { }
export class NetworkFailure extends Failure { }
export class InvalidCardFailure extends Failure { }
export class PaymentFailure extends Failure { }
export class StorageFailure extends Failure { }
export class LimitReachedFailure extends Failure { }
