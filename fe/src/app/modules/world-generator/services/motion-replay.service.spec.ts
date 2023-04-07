import { TestBed } from '@angular/core/testing';

import { MotionReplayService } from './motion-replay.service';

describe('MotionReplayService', () => {
  let service: MotionReplayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MotionReplayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
