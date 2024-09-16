import cron from 'node-cron';
import Campaing from '../models/campaignModel'; // Importar o modelo de campanha

// Função para verificar e disparar campanhas
async function checkAndTriggerCampaigns() {
  const now = new Date();

  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }); // Ex: "Monday"
  const currentTime = now.toTimeString().substring(0, 5); // Ex: "14:30"

  try {
    // Buscar campanhas ativas que correspondem ao dia e horário atuais
    const campaigns = await Campaing.find({
      enable: true,
      "schedule.validDays": currentDay,
      "schedule.timeOfDay": currentTime,
      "activationDate.initDate": { $lte: now },
      "activationDate.endDate": { $gte: now }
    });

    // Disparar ações para cada campanha
    campaigns.forEach(campaign => {
      console.log(`Disparando campanha: ${campaign.caption}`);
      // Aqui você pode implementar a lógica de disparo, como envio de mensagens ou notificações.
    });
  } catch (error) {
    console.error('Erro ao verificar campanhas:', error);
  }
}

// Função para agendar os cron jobs
export function scheduleCronJobs() {
  // Agendar o cron job para rodar a cada minuto
  cron.schedule('* * * * *', () => {
    console.log('Verificando campanhas a cada minuto...');
    checkAndTriggerCampaigns();
  });
}
