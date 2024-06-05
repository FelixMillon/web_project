import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { User } from './user.model';

describe('AppController', () => {
  let userService: UserService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserResolver],
      providers: [UserService],
    }).compile();
    userService = app.get(UserService);
    await app.init();
  });

  describe('createUser', () => {
    const userData = {
      email: "toto@gmail.com",
      pseudo: "toto",
      name: "toto",
      password: "Azerty@123"
    }
    it('should return true', () => {
      const result = userService.create(userData);
      expect(result).toBe(
        {
          id: "1",
          email: "toto@gmail.com",
          pseudo: "toto",
          name: "toto",
          password: "Azerty@123"
        }
      );
    });

    const falseUserSet = [
      {
        email: "toto",
        pseudo: "toto",
        name: "toto",
        password: "Azerty@123"
      },
      {
        email: "tutu@gmail.com",
        name: "tu",
        password: "Azerty@123"
      },
      {
        email: "titi@gmail.com",
        pseudo: "titu",
        name: "",
        password: "Azerty@123"
      },
      {
        email: "tptp@gmail.com",
        pseudo: "tptp",
        name: "tptp",
        password: "password"
      },
    ]
    it('should return false', () => {
      for(const userData of falseUserSet){
        const result = userService.create(userData);
        expect(result).toBe(400);
      }
    });
  });


  describe('updateUser', () => {
    const userData = {
      email: "toto@gmail.com",
      pseudo: "toto",
      name: "toto",
      password: "Azerty@123"
    }
    
    userService.create(userData);
    const updateDataTrue = {
      pseudo: "tutu"
    }
    it('should return true', () => {
      const result = userService.update(updateDataTrue);
        expect(result).toBe(true);
    });
    const updateDataFalse = {
      pseudo: ""
    }
    it('should return false', () => {
      const result = userService.update(updateDataFalse);
        expect(result).toBe(400);
    });
  });

  
  // describe('GET /user/:userId', () => {
  //   beforeEach(async () => {
  //       app = await createNestApplication();
  //       taskService = app.get(TaskService);
  //       userService = app.get(UserService);

  //       await app.init();
  //   });

  //   afterEach(async () => {
  //       await taskService.resetData();
  //       await userService.resetData();
  //       await app.close();
  //   });

  //   it('should return an HTTP error status 400 when given userId is not valid', async () => {
  //       const invalidUserIds = ['h e', '-87', 'eeee'];

  //       for (const userId of invalidUserIds) {
  //           const response = await request(app.getHttpServer()).get(
  //               `/task/user/${userId}`,
  //           );

  //           expect(response.status).toBe(400);
  //       }
  //   });

  //   it('should return an HTTP status 200 when given userId is valid', async () => {
  //       const createdElements = await createTasksFor2DifferentUsers(
  //           userService,
  //           taskService,
  //       );

  //       for (const created of createdElements) {
  //           const response = await request(app.getHttpServer()).get(
  //               `/task/user/${created.user.id}`,
  //           );

  //           expect(response.status).toBe(200);

  //           const haveAllTasksBeenReturned = response.body.every((task) =>
  //               created.tasks.some(
  //                   (createdTask) => createdTask.id === task.id,
  //               ),
  //           );
  //           expect(haveAllTasksBeenReturned).toBe(true);
  //       }
  //   });
  // });
});
