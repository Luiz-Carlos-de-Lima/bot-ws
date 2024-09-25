import cron from "node-cron";
import Campaing from "../models/campaignModel"; // Importar o modelo de campanha
import WhatsappController from "../controllers/whatsappController";

// Função para verificar e disparar campanhas
async function checkAndTriggerCampaigns() {
  const now = new Date();
  const whatsappController = new WhatsappController();

  const currentDay = now.toLocaleDateString("en-US", { weekday: "long" }); // Ex: "Monday"
  const currentTime = now.toTimeString().substring(0, 5); // Ex: "14:30"

  try {
    // Buscar campanhas ativas que correspondem ao dia e horário atuais
    const campaigns = await Campaing.find({
      enable: true,
      "schedule.day": currentDay,
      "schedule.timeOfDay": currentTime,
    });

    console.log(campaigns);

    // Função para processar cada número de telefone com um intervalo de 10 segundos
    const sendMessagesWithDelay = (phoneNumbers, image, caption, index = 0) => {
      if (index >= phoneNumbers.length) return; // Terminar quando todos os números forem processados

      const phoneNumber = phoneNumbers[index];
      console.log(`Enviando mensagem para: ${phoneNumber}`);

      // Enviar a mensagem (ajuste a lógica de envio aqui conforme necessário)
      whatsappController.sendImage(phoneNumber, image, caption);

      // Disparar a próxima mensagem após 10 segundos
      setTimeout(() => {
        sendMessagesWithDelay(phoneNumbers, image, caption, index + 1);
      }, 10000); // 10 segundos = 10.000 ms
    };

    // Função para processar cada campanha com um intervalo de 30 segundos
    const triggerCampaignWithDelay = async (campaigns, index = 0) => {
      if (index >= campaigns.length) return; // Terminar quando todas as campanhas forem disparadas

      const campaign = campaigns[index];
      console.log(`Disparando campanha: ${campaign.caption}`);

      // Iniciar o envio de mensagens com delay para cada número de telefone da campanha
      sendMessagesWithDelay(
        campaign.listPhoneNumber,
        campaign.base64Image,
        campaign.caption
      );

      // Disparar a próxima campanha após 30 segundos
      setTimeout(() => {
        triggerCampaignWithDelay(campaigns, index + 1);
      }, 30000); // 30 segundos = 30.000 ms
    };

    // Iniciar o disparo da primeira campanha
    if (campaigns.length > 0) {
      console.log("Iniciando disparo das campanhas...");
      triggerCampaignWithDelay(campaigns);
    } else {
      console.log("Nenhuma campanha para disparar neste momento.");
    }
  } catch (error) {
    console.error("Erro ao verificar campanhas:", error);
  }
}

// Função para agendar os cron jobs
export function scheduleCronJobs() {
  // Agendar o cron job para rodar a cada minuto
  cron.schedule("* * * * *", () => {
    console.log("Verificando campanhas a cada minuto...");
    checkAndTriggerCampaigns();
  });
}
