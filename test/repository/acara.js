import sinon from 'sinon';
import chai from 'chai';

import { createConnection } from './../../src/helpers/database';
import { AcaraRepository } from './../../src/repository/acara';

import { truncate, seed } from './../helpers/repository/acara';

const expect = chai.expect;

const acaraRepository = AcaraRepository(createConnection('dev'));

describe('findAll', function() {
  beforeEach(function() {
    return truncate()
      .then(() => seed());
  });

  afterEach(function() {
    return truncate()
      .then(() => seed());
  });

  it('should return 3 acara', async function() {
    const spy = sinon.spy(acaraRepository, 'findAll');
    
    const result = await acaraRepository.findAll();

    spy.restore();

    expect(result).to.eql([
      {
        id: 1,
        name: 'Test acara',
        start_time: new Date('2019-06-10 10:00:00'),
        end_time: new Date('2019-06-10 12:00:00'),
        status: 1,
        desc: 'Test description',
        user_name: 'Gunawan Christanto',
        room_name: '9121',
      },
      {
        id: 2,
        name: 'Test acara lagi beneran',
        start_time: new Date('2019-06-12 10:00:00'),
        end_time: new Date('2019-06-12 12:00:00'),
        status: 1,
        desc: 'Test description lagi beneran',
        user_name: 'Cristopher Namchee',
        room_name: '10316',
      },
      {
        id: 3,
        name: 'Test acara lagi',
        start_time: new Date('2019-06-14 10:00:00'),
        end_time: new Date('2019-06-14 12:00:00'),
        status: 2,
        desc: 'Test description lagi',
        user_name: 'Cristopher Namchee',
        room_name: '10316',
      }
    ]);

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy);
  });
});

describe('findByStatus', function() {
  beforeEach(function() {
    return truncate()
      .then(() => seed());
  });

  afterEach(function() {
    return truncate()
      .then(() => seed());
  });

  it('should return 2 acara', async function() {
    const spy = sinon.spy(acaraRepository, 'findByStatus');

    const expectedArgs = { status: 1 };

    const result = await acaraRepository.findByStatus(expectedArgs);

    spy.restore();

    expect(result).to.eql([
      {
        id: 1,
        name: 'Test acara',
        start_time: new Date('2019-06-10 10:00:00'),
        end_time: new Date('2019-06-10 12:00:00'),
        status: 1,
        desc: 'Test description',
        user_name: 'Gunawan Christanto',
        room_name: '9121',
      },
      {
        id: 2,
        name: 'Test acara lagi beneran',
        start_time: new Date('2019-06-12 10:00:00'),
        end_time: new Date('2019-06-12 12:00:00'),
        status: 1,
        desc: 'Test description lagi beneran',
        user_name: 'Cristopher Namchee',
        room_name: '10316',
      },
    ]);

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, expectedArgs);
  });

  it('should return 1 acara', async function() {
    const spy = sinon.spy(acaraRepository, 'findByStatus');
    const expectedArgs = { status: 2 };
    
    const result = await acaraRepository.findByStatus(expectedArgs);

    spy.restore();

    expect(result).to.eql([
      {
        id: 3,
        name: 'Test acara lagi',
        start_time: new Date('2019-06-14 10:00:00'),
        end_time: new Date('2019-06-14 12:00:00'),
        status: 2,
        desc: 'Test description lagi',
        user_name: 'Cristopher Namchee',
        room_name: '10316',
      },
    ]);

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, expectedArgs);
  });

  it('should return an empty array', async function() {
    const spy = sinon.spy(acaraRepository, 'findByStatus');
    const expectedArgs = { status: 0 };

    const result = await acaraRepository.findByStatus(expectedArgs);

    spy.restore();

    expect(result).to.eql([]);

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, expectedArgs);
  });
});

describe('findByName', function() {
  beforeEach(function() {
    return truncate()
      .then(() => seed());
  });

  afterEach(function() {
    return truncate()
      .then(() => seed());
  });

  it('should return 2 acara', async function() {
    const spy = sinon.spy(acaraRepository, 'findByName');
    const expectedArgs = { name: 'lagi' };

    const result = await acaraRepository.findByName(expectedArgs);

    spy.restore();

    expect(result).to.eql([
      {
        id: 2,
        name: 'Test acara lagi beneran',
        start_time: new Date('2019-06-12 10:00:00'),
        end_time: new Date('2019-06-12 12:00:00'),
        status: 1,
        desc: 'Test description lagi beneran',
        user_name: 'Cristopher Namchee',
        room_name: '10316',
      },
      {
        id: 3,
        name: 'Test acara lagi',
        start_time: new Date('2019-06-14 10:00:00'),
        end_time: new Date('2019-06-14 12:00:00'),
        status: 2,
        desc: 'Test description lagi',
        user_name: 'Cristopher Namchee',
        room_name: '10316',
      }
    ]);

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, expectedArgs);
  });

  it('should return an empty array', async function() {
    const spy = sinon.spy(acaraRepository, 'findByName');
    const expectedArgs = { name: 'DOOMED' };

    const result = await acaraRepository.findByName(expectedArgs);

    spy.restore();

    expect(result).to.eql([]);

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, expectedArgs);
  });
});

describe('findConflictingAcara', function() {
  beforeEach(function() {
    return truncate()
      .then(() => seed());
  });

  afterEach(function() {
    return truncate()
      .then(() => seed());
  });

  it('should return true because schedule has already been used', async function() {
    const spy = sinon.spy(acaraRepository, 'findConflictingAcara');
    const expectedArgs = { startTime: '2019-06-10 10:00:00', endTime: '2019-06-10 17:00:00', roomId: 1 };

    const result = await acaraRepository.findConflictingAcara(expectedArgs);
    const processed = result[0].conflicts > 0;

    spy.restore();

    expect(processed).to.be.true;

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, expectedArgs);
  });

  it('should return false because schedule hasn\'t been used yet', async function() {
    const spy = sinon.spy(acaraRepository, 'findConflictingAcara');
    const expectedArgs = { startTime: '2019-06-10 15:00:00', endTime: '2019-06-10 17:00:00', roomId: 10 };

    const result = await acaraRepository.findConflictingAcara(expectedArgs);

    spy.restore();

    expect(result).to.eql([]);

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, expectedArgs);
  });
});

describe('findUserAcara', function() {
  beforeEach(function() {
    return truncate()
      .then(() => seed());
  });

  afterEach(function() {
    return truncate()
      .then(() => seed());
  });

  it('should return one acara', async function() {
    const spy = sinon.spy(acaraRepository, 'findUserAcara');
    const expectedArgs = { id: 2 };

    const result = await acaraRepository.findUserAcara(expectedArgs);

    spy.restore();

    expect(result).to.eql([
      {
        id: 1,
        name: 'Test acara',
        start_time: new Date('2019-06-10 10:00:00'),
        end_time: new Date('2019-06-10 12:00:00'),
        status: 1,
        desc: 'Test description',
        user_name: 'Gunawan Christanto',
        room_name: '9121',
      },
    ]);

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, expectedArgs);
  });

  it('should return an empty array', async function() {
    const spy = sinon.spy(acaraRepository, 'findUserAcara');
    const expectedArgs = { id: 10000 };

    const result = await acaraRepository.findUserAcara(expectedArgs);

    spy.restore();

    expect(result).to.eql([]);

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, expectedArgs);
  });
});

describe('getAcara', function() {
  beforeEach(function() {
    return truncate()
      .then(() => seed());
  });

  afterEach(function() {
    return truncate()
      .then(() => seed());
  });
});
