import { Test, TestingModule } from '@nestjs/testing';
import { GoogleAuthenticatonService } from './google-authenticaton.service';

describe('GoogleAuthenticatonService', () => {
  let service: GoogleAuthenticatonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoogleAuthenticatonService],
    }).compile();

    service = module.get<GoogleAuthenticatonService>(GoogleAuthenticatonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
