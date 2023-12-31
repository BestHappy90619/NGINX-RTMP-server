import {BaseController} from "./BaseController";
import {Request, Response, Router} from "express";

export class IndexController extends BaseController {

    init(router: Router): void {

        router.get('/favicon.ico', function (req: Request, res: Response) {
            return res.status(204).end();
        });

        router.get('/', function (req: Request, res: Response) {
            res.send('Hello world from nginx-rtmp-server - API Server');
        });
    }
}