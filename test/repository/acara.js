import sinon from 'sinon';
import chai from 'chai';

import { createConnection } from './../../src/helpers/database';
import { AcaraRepository } from './../../src/repository/acara';

import { truncate, seed } from './../helpers/repository/acara';

const expect = chai.expect;

const acaraRepository = AcaraRepository(createConnection('dev'));

describe('findAll', function () {
  beforeEach(function () {
    return truncate()
      .then(() => seed());
  });

  afterEach(function () {
    return truncate()
      .then(() => seed());
  });

  it('should return 3 acara', async function () {
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

describe('findByStatus', function () {
  beforeEach(function () {
    return truncate()
      .then(() => seed());
  });

  afterEach(function () {
    return truncate()
      .then(() => seed());
  });

  it('should return 2 acara', async function () {
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

  it('should return 1 acara', async function () {
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

  it('should return an empty array', async function () {
    const spy = sinon.spy(acaraRepository, 'findByStatus');
    const expectedArgs = { status: 0 };

    const result = await acaraRepository.findByStatus(expectedArgs);

    spy.restore();

    expect(result).to.eql([]);

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, expectedArgs);
  });
});

describe('findByName', function () {
  beforeEach(function () {
    return truncate()
      .then(() => seed());
  });

  afterEach(function () {
    return truncate()
      .then(() => seed());
  });

  it('should return 2 acara', async function () {
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

  it('should return an empty array', async function () {
    const spy = sinon.spy(acaraRepository, 'findByName');
    const expectedArgs = { name: 'DOOMED' };

    const result = await acaraRepository.findByName(expectedArgs);

    spy.restore();

    expect(result).to.eql([]);

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, expectedArgs);
  });
});

describe('findConflictingAcara', function () {
  beforeEach(function () {
    return truncate()
      .then(() => seed());
  });

  afterEach(function () {
    return truncate()
      .then(() => seed());
  });

  it('should return true because schedule has already been used', async function () {
    const spy = sinon.spy(acaraRepository, 'findConflicts');
    const expectedArgs = { startTime: '2019-06-10 10:00:00', endTime: '2019-06-10 17:00:00', roomId: 1 };

    const result = await acaraRepository.findConflicts(expectedArgs);
    const processed = result.length > 0;

    spy.restore();

    expect(processed).to.be.true;

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, expectedArgs);
  });

  it('should return false because schedule hasn\'t been used yet', async function () {
    const spy = sinon.spy(acaraRepository, 'findConflicts');
    const expectedArgs = { startTime: '2019-06-10 15:00:00', endTime: '2019-06-10 17:00:00', roomId: 10 };

    const result = await acaraRepository.findConflicts(expectedArgs);

    spy.restore();

    expect(result).to.eql([]);

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, expectedArgs);
  });
});

describe('findUserAcara', function () {
  beforeEach(function () {
    return truncate()
      .then(() => seed());
  });

  afterEach(function () {
    return truncate()
      .then(() => seed());
  });

  it('should return one acara', async function () {
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

  it('should return an empty array', async function () {
    const spy = sinon.spy(acaraRepository, 'findUserAcara');
    const expectedArgs = { id: 10000 };

    const result = await acaraRepository.findUserAcara(expectedArgs);

    spy.restore();

    expect(result).to.eql([]);

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, expectedArgs);
  });
});

describe('get', function () {
  beforeEach(function () {
    return truncate()
      .then(() => seed());
  });

  afterEach(function () {
    return truncate()
      .then(() => seed());
  });

  it('should return an acara', async function () {
    const spy = sinon.spy(acaraRepository, 'get');
    const expectedArgs = { id: 1 };

    const result = await acaraRepository.get(expectedArgs);

    spy.restore();

    expect(result).to.eql([
      {
        id: 1,
        name: 'Test acara',
        start_time: new Date('2019-06-10 10:00:00'),
        end_time: new Date('2019-06-10 12:00:00'),
        desc: 'Test description',
        user_id: 2,
        user_name: 'Gunawan Christanto',
        room_id: 1,
      },
    ]);

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, expectedArgs);
  });

  it('should return an empty array', async function () {
    const spy = sinon.spy(acaraRepository, 'get');
    const expectedArgs = { id: 1000 };

    const result = await acaraRepository.get(expectedArgs);

    spy.restore();

    expect(result).to.eql([]);

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, expectedArgs);
  });
});

describe('exist', function () {
  beforeEach(function () {
    return truncate()
      .then(() => seed());
  });

  afterEach(function () {
    return truncate()
      .then(() => seed());
  });

  it('should return true because it exists in the database', async function () {
    const spy = sinon.spy(acaraRepository, 'exist');
    const expectedArgs = { id: 1 };

    const result = await acaraRepository.exist(expectedArgs);

    spy.restore();

    const processed = result[0].jml > 0;

    expect(processed).to.be.true;

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, expectedArgs);
  });

  it('should return false because it doesn\'t exist in the database', async function () {
    const spy = sinon.spy(acaraRepository, 'exist');
    const expectedArgs = { id: 1000 };

    const result = await acaraRepository.exist(expectedArgs);

    spy.restore();

    const processed = result[0].jml > 0;

    expect(processed).to.be.false;

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, expectedArgs);
  });
});

describe('create', function () {
  beforeEach(function () {
    return truncate()
      .then(() => seed());
  });

  afterEach(function () {
    return truncate()
      .then(() => seed());
  });

  it('should create 1 new acara', async function () {
    const spy = sinon.spy(acaraRepository, 'create');
    const expectedArgs = {
      startTime: new Date('2019-06-10 10:00:00'),
      endTime: new Date('2019-06-10 12:00:00'),
      name: 'AHAHAHA',
      status: 1,
      desc: 'IHIHI',
      userId: 1,
      roomId: 2,
    };

    await acaraRepository.create(expectedArgs);

    spy.restore();

    const result = await acaraRepository.get({ id: 4 });

    expect(result).to.eql([
      {
        id: 4,
        start_time: new Date('2019-06-10 10:00:00'),
        end_time: new Date('2019-06-10 12:00:00'),
        name: 'AHAHAHA',
        desc: 'IHIHI',
        user_id: 1,
        user_name: 'Cristopher Namchee',
        room_id: 2,
      },
    ]);

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, expectedArgs);
  });

  it('should be rejected because name is too long', async function () {
    const spy = sinon.spy(acaraRepository, 'create');
    const expectedArgs = {
      startTime: new Date('2019-06-10 10:00:00'),
      endTime: new Date('2019-06-10 12:00:00'),
      name: 'jiasodfoadshviashv-asv9hd9-syvhf9-dsv9-d9fsv9-dsuv9-dsfuv-9dhv-9dfsyhv-9dyhfv-9yuhj29q-yh4gwqhvg-9ys-fv9uas9-vu9-asvud-asuvusv-asuv-asd9aus-f-asuf9as',
      status: 1,
      desc: 'IHIHI',
      userId: 1,
      roomId: 2,
    };

    try {
      await acaraRepository.create(expectedArgs);
    } catch (err) {
      spy.restore();

      const errorNumber = err.errno;
      expect(errorNumber).to.equal(1406);

      sinon.assert.calledOnce(spy);
      sinon.assert.calledWith(spy, expectedArgs);
    }
  });

  it('should be rejected because description is too long', async function () {
    const spy = sinon.spy(acaraRepository, 'create');
    const expectedArgs = {
      startTime: new Date('2019-06-10 10:00:00'),
      endTime: new Date('2019-06-10 12:00:00'),
      name: 'ehehe',
      status: 1,
      desc: 'bojaswviawbovuoauwbvawboviwboivbaswvboaiwbvoiwbvoiqewbvoiewbvoiewbovibewovebnsjdvnnasvoldnfsovidnfsovndsvbndisvndsb vdfbvgoiwhnagfv0wgfv9ausjvjdahsf0asudf90as',
      userId: 1,
      roomId: 2,
    };

    try {
      await acaraRepository.create(expectedArgs);
    } catch (err) {
      spy.restore();

      const errorNumber = err.errno;
      expect(errorNumber).to.equal(1406);

      sinon.assert.calledOnce(spy);
      sinon.assert.calledWith(spy, expectedArgs);
    }
  });
});

describe('update', function () {
  beforeEach(function () {
    return truncate()
      .then(() => seed());
  });

  afterEach(function () {
    return truncate()
      .then(() => seed());
  });

  it('should update one acara', async function () {
    const spy = sinon.spy(acaraRepository, 'update');
    const expectedArgs = {
      id: 1,
      startTime: new Date('2019-06-10 10:00:00'),
      endTime: new Date('2019-06-10 12:00:00'),
      name: 'AHAHAHA',
      status: 1,
      desc: 'IHIHI',
      userId: 1,
      roomId: 2,
    };

    await acaraRepository.update(expectedArgs);

    spy.restore();

    const result = await acaraRepository.get({ id: 1 });

    expect(result).to.eql([
      {
        id: 1,
        start_time: new Date('2019-06-10 10:00:00'),
        end_time: new Date('2019-06-10 12:00:00'),
        name: 'AHAHAHA',
        desc: 'IHIHI',
        user_id: 1,
        user_name: 'Cristopher Namchee',
        room_id: 2,
      }
    ]);

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, expectedArgs);
  });

  it('should be rejected because name is too long', async function () {
    const spy = sinon.spy(acaraRepository, 'update');
    const expectedArgs = {
      id: 1,
      startTime: new Date('2019-06-10 10:00:00'),
      endTime: new Date('2019-06-10 12:00:00'),
      name: 'jiasodfoadshviashv-asv9hd9-syvhf9-dsv9-d9fsv9-dsuv9-dsfuv-9dhv-9dfsyhv-9dyhfv-9yuhj29q-yh4gwqhvg-9ys-fv9uas9-vu9-asvud-asuvusv-asuv-asd9aus-f-asuf9as',
      status: 1,
      desc: 'IHIHI',
      userId: 1,
      roomId: 2,
    };

    try {
      await acaraRepository.update(expectedArgs);
    } catch (err) {
      spy.restore();

      const errorNumber = err.errno;

      expect(errorNumber).to.equal(1406);

      sinon.assert.calledOnce(spy);
      sinon.assert.calledWith(spy, expectedArgs);
    }
  });

  it('should be rejected because description is too long', async function () {
    const spy = sinon.spy(acaraRepository, 'update');
    const expectedArgs = {
      id: 1,
      startTime: new Date('2019-06-10 10:00:00'),
      endTime: new Date('2019-06-10 12:00:00'),
      name: 'ehehe',
      status: 1,
      desc: 'bojaswviawbovuoauwbvawboviwboivbaswvboaiwbvoiwbvoiqewbvoiewbvoiewbovibewovebnsjdvnnasvoldnfsovidnfsovndsvbndisvndsb vdfbvgoiwhnagfv0wgfv9ausjvjdahsf0asudf90as',
      userId: 1,
      roomId: 2,
    };

    try {
      await acaraRepository.update(expectedArgs);
    } catch (err) {
      spy.restore();

      const errorNumber = err.errno;

      expect(errorNumber).to.equal(1406);

      sinon.assert.calledOnce(spy);
      sinon.assert.calledWith(spy, expectedArgs);
    }
  });

  it('shouldn\'t change anything', async function () {
    const spy = sinon.spy(acaraRepository, 'update');
    const expectedArgs = {
      id: 10000,
      startTime: new Date('2019-06-10 10:00:00'),
      endTime: new Date('2019-06-10 12:00:00'),
      name: 'ehehe',
      status: 1,
      desc: 'vdfbvgoiwhnagfv0wgfv9ausjvjdahsf0asudf90as',
      userId: 1,
      roomId: 2,
    };

    await acaraRepository.update(expectedArgs);

    spy.restore();

    const result = await acaraRepository.findAll();

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
    sinon.assert.calledWith(spy, expectedArgs);
  });
});

describe('delete', function () {
  beforeEach(function () {
    return truncate()
      .then(() => seed());
  });

  afterEach(function () {
    return truncate()
      .then(() => seed());
  });

  it('should delete an acara', async function () {
    const spy = sinon.spy(acaraRepository, 'delete');
    const expectedArgs = { id: 1, };

    await acaraRepository.delete(expectedArgs);

    spy.restore();

    const result = await acaraRepository.get({ id: 1, });

    expect(result).to.eql([]);

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, expectedArgs);
  });

  it('shouldn\'t delete anything', async function () {
    const spy = sinon.spy(acaraRepository, 'delete');
    const expectedArgs = { id: 12321321, };

    await acaraRepository.delete(expectedArgs);

    spy.restore();

    const result = await acaraRepository.findAll();

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
      },
    ]);

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, expectedArgs);
  });
});
