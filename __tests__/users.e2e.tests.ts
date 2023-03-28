import request from "supertest";
import {app} from "../setting";
import {HTTP_STATUSES} from "../src/http_statuses";
import {userRepository} from "../src/repositories/user-repositpry";
import {userService} from "../src/services/user-service";

describe('user_test', () => {
    let user: any = {}
    let users:any = []
    it('GET, get empty array users', async () => {
        await request(app)
            .get('/users')
            .expect(startResponse)
    })

    it('POST, try created user with invalid value', async () => {
        await request(app)
            .post('/users')
            .auth('admin', 'qwerty', {type: "basic"})
            .send({
                login: "",
                password: "",
                email: "dqweqeq"
            })
            .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                errorsMessages: [{message: 'Not correct length', field: 'login'},
                    {message: 'Not correct length', field: 'password'},
                    {message: 'Is not email!', field: 'email'}
                ]
            })
    })

    it('POST, try created user no authorized', async () => {
        await request(app)
            .post('/users')
            .send({
                login: "",
                password: "",
                email: ""
            })
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })

    it('POST, try created user', async () => {
        const response = await request(app)
            .post('/users')
            .auth('admin', 'qwerty', {type: "basic"})
            .send({
                login: "EvilGrand",
                password: "12345678",
                email: "EvilGrand@mail.ru"
            })
            .expect(HTTP_STATUSES.CREATED_201)

        user = response.body
        expect(user.login).toBe("EvilGrand")
    })

    it("GET,try search user by non-existent login ", async () => {
        await request(app)
            .get('/users' + '?searchLoginTerm=Evwlg')
            .auth('admin', 'qwerty', {type: "basic"})
            .expect(HTTP_STATUSES.OK200, {
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                }
            )
    })

    it("GET, search user by login ", async () => {
        await request(app)
            .get('/users' + '?searchLoginTerm=Evilg')
            .auth('admin', 'qwerty', {type: "basic"})
            .expect(HTTP_STATUSES.OK200, {
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 1,
                    items: [user]
                }
            )
    })

    it("created some users ", async () => {
        for await (const contents of testsUser.map(u => userService.createUser(u))) {
        }
        const result = await request(app)
            .get('/users' + '?searchEmailTerm=.com')
            .auth('admin', 'qwerty', {type: "basic"})
        users = await result.body.items.filter((el: any) => el.email.indexOf(".com"))
    })

    it("GET, search some users by email ", async () => {
        await request(app)
            .get('/users' + '?searchEmailTerm=.com')
            .auth('admin', 'qwerty', {type: "basic"})
            .expect(HTTP_STATUSES.OK200,  {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 5,
                items: users
            })
    })

    it("Delete, try remove user by invalid id", async () => {
        await request(app)
            .delete('/users' + '1232345')
            .auth('admin', 'qwerty', {type: "basic"})
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it("Delete, try remove user by invalid id", async () => {
        await request(app)
            .delete('/users/' + user.id)
            .auth('admin', 'qwerty', {type: "basic"})
            .expect(HTTP_STATUSES.NO_CONTENT_204)
    })

    afterAll(async () => {
        await userRepository.deleteAllUser()
    })

})



const startResponse = {pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: []}



const testsUser = [{
    "login": "EvilGrand2",
    "password": "12345678",
    "email": "EvilGrand@mail.ru"
}, {
    "login": "EvilGrand3",
    "password": "12345678",
    "email": "EvilGrand@mail.ru"
},
    {
        "login": "Piple",
        "password": "12345678",
        "email": "Piple@mail.ru"
    },
    {
        "login": "Piple2",
        "password": "12345678",
        "email": "Piple2@mail.ru"
    },
    {
        "login": "Kolins",
        "password": "12345678",
        "email": "Kolins@google.com"
    },
    {
        "login": "Fedors",
        "password": "12345678",
        "email": "Fedors@google.com"
    },
    {
        "login": "Edvord",
        "password": "12345678",
        "email": "Edvord@google.com"
    },
    {
        "login": "Wiita",
        "password": "12345678",
        "email": "Wiita@google.com"
    },
    {
        "login": "Loutaro",
        "password": "12345678",
        "email": "Loutaro@google.com"
    }
]

