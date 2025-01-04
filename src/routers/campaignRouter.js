import { Router } from "express";
import BaseRouter from "./baseRouter";

import CampaignController from "../controllers/campaignsController";

export default class CampaingRouter extends BaseRouter {
  router = Router();
  campaignController = new CampaignController();

  constructor() {
    super();
    this.createCampaign();
    this.getCampaign();
    this.deleteCampaign();
    this.editCampaign();
  }

  createCampaign() {
    this.router.post("/createCampaign", async (req, res) => {
      try {
        const body = req.body;

        if (!body.description) {
          throw Error("Campo 'description' do tipo String é obrigatório!");
        }
        if (!body.listPhoneNumber) {
          throw Error(
            "Campo 'listPhoneNumber' obrigatório!"
          );
        }
        if (!body.startDate) {
          throw Error("Campo 'startDate' obrigatório!");
        }
        if (!body.endDate) {
          throw Error("Campo 'endDate' obrigatório!");
        }
        if (!body.caption) {
          throw Error("Campo 'caption' do tipo String é obrigatório!");
        }
        if (!body.base64Image) {
          throw Error("Campo 'base64Image' do tipo String é obrigatório!");
        }
        if (!body.schedule) {
          throw Error("Campo 'schedule' do tipo Array é obrigatório!");
        }

        await this.campaignController.createCampaign(
          body.description,
          body.listPhoneNumber.map((phoneNumber) => {
            return {
              name: phoneNumber.nome,
              ddd: phoneNumber.ddd.replace(/[()\-\s]/g, ""),
              number: phoneNumber.number.replace(/[()\-\s]/g, ""),
            }
          },
          ),
          body.caption,
          body.base64Image,
          body.enable ?? true,
          body.schedule,
          body.startDate,
          body.endDate,
        );
        this.ok({}, res);
      } catch (e) {
        console.log(e);
        this.fail(e.toString(), res);
      }
    });
  }

  getCampaign() {
    this.router.get("/getCampaign", async (req, res) => {
      try {
        let listCampaign = [];
        if (req.query.id) {
          let campaign = await this.campaignController.getCampaignById(
            req.query.id
          );
          listCampaign.push(campaign);
        } else {
          listCampaign = await this.campaignController.getAllCampaign(
            req.params.id
          );
        }

        this.ok(listCampaign, res);
      } catch (e) {
        this.fail(e.toString(), res);
      }
    });
  }

  deleteCampaign() {
    this.router.delete("/deleteCampaign", async (req, res) => {
      try {
        console.log(req);
        if (req.query.id) {
          let respose = await this.campaignController.deleteCampaign(
            req.query.id
          );
          this.ok(respose, res);
        } else {
          this.fail(
            "Não é possivel deletar a campanha, Id não informado.",
            res
          );
        }
      } catch (e) {
        this.fail(e.toString(), res);
      }
    });
  }

  editCampaign() {
    this.router.post("/editCampaign", async (req, res) => {
      try {
        const body = req.body;

        if (!body.id) {
          throw Error("Campo 'id' do tipo String é obrigatório!");
        }
        if (!body.description) {
          throw Error("Campo 'description' do tipo String é obrigatório!");
        }
        if (!body.listPhoneNumber) {
          throw Error(
            "Campo 'listPhoneNumber' do tipo Array de String é obrigatório!"
          );
        }
        if (!body.caption) {
          throw Error("Campo 'caption' do tipo String é obrigatório!");
        }
        if (!body.base64Image) {
          throw Error("Campo 'base64Image' do tipo String é obrigatório!");
        }
        if (!body.schedule) {
          throw Error("Campo 'schedule' do tipo Array é obrigatório!");
        }

        let response = await this.campaignController.editCampaign(
          body.id,
          body.description,
          body.listPhoneNumber.map((phoneNumber) =>
            phoneNumber.replace(/[()\-\s]/g, "")
          ),
          body.caption,
          body.base64Image,
          body.enable ?? true,
          body.schedule
        );
        this.ok(response, res);
      } catch (e) {
        console.log(e);
        this.fail(e.toString(), res);
      }
    });
  }
}
