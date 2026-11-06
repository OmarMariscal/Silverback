import { JwtAuthGuard } from './jwt.guard';

describe('JwtAuthGuard', () => {
  beforeEach(() => {
    process.env.NODE_ENV = 'development';
  });

  it('usa el usuario mock por defecto del contralor sembrado cuando no llega x-mock-user-id', () => {
    const guard = new JwtAuthGuard();
    const request: any = {
      headers: {
        'x-mock-role': 'CONTRALOR',
      },
    };

    const context: any = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    };

    expect(guard.canActivate(context)).toBe(true);
    expect(request.user.usuario_id).toBe('a8f99f0d-c949-4feb-b849-44a5305e2f45');
  });
});
