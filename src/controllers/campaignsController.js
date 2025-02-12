import moment from "moment";
import campaignModel from "../models/campaignModel";

export default class CampaignController {
  async getAllCampaign() {
    try {
      const campaigns = await campaignModel.find();
      return campaigns; // Retorna a lista de campanhas encontradas
    } catch (error) {
      throw new Error(`Erro ao buscar campanhas: ${error.message}`);
    }
  }

  async getCampaignById(idCampaign) {
    try {
      const campaign = await campaignModel.findById(idCampaign);
      return campaign;
    } catch (error) {
      throw new Error(`Erro ao buscar campanha por ID: ${error.message}`);
    }
  }

  async createCampaign(
    description,
    listPhoneNumber,
    caption,
    base64Image,
    enable,
    schedule,
    startDate,
    endDate,
  ) {
    const newCampaign = new campaignModel({
      description,
      listPhoneNumber,
      caption,
      base64Image,
      enable,
      schedule,
      startDate: moment(startDate).startOf('day').toISOString(),
      endDate: moment(endDate).endOf('day').toISOString(),
    });

    await newCampaign.save();
  }

  async deleteCampaign(campaignId) {
    try {
      await campaignModel.findByIdAndDelete(campaignId);
      return { message: "Campanha deletada com sucesso" };
    } catch (error) {
      throw new Error(`Erro ao deletar campanha: ${error.message}`);
    }
  }

  async editCampaign(
    campaignId,
    description,
    listPhoneNumber,
    caption,
    base64Image,
    enable,
    schedule,
    startDate,
    endDate,
  ) {
    try {
      const updatedCampaign = await campaignModel.findByIdAndUpdate(
        campaignId,
        {
          description,
          listPhoneNumber,
          caption,
          base64Image,
          enable,
          schedule,
          startDate: moment(startDate).startOf('day').toISOString(),
          endDate: moment(endDate).endOf('day').toISOString(),
        },
        { new: true }
      );
      return updatedCampaign;
    } catch (error) {
      throw new Error(`Erro ao editar campanha: ${error.message}`);
    }
  }
}
