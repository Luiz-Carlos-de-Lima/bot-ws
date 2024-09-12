'use strict';

import path from 'path';
import fs from 'fs';

import  BaseAuthStrategy  from "./BaseAuthStrategy";
/**
 * Local directory-based authentication
 * @param {object} options - options
 * @param {string} options.clientId - Client id to distinguish instances if you are using multiple, otherwise keep null if you are using only one instance
 * @param {string} options.dataPath - Change the default path for saving session files, default is: "./.wwebjs_auth/"
*/
class AlphaxLocalAuth extends BaseAuthStrategy {
    constructor({ clientId, dataPath }={}) {
        super();

        const idRegex = /^[-_\w]+$/i;
        if(clientId && !idRegex.test(clientId)) {
            throw new Error('Invalid clientId. Only alphanumeric characters, underscores and hyphens are allowed.');
        }

        this.dataPath = path.resolve(dataPath || './.wwebjs_auth/');
        console.log(this.dataPath);
        this.clientId = clientId;
    }

    async beforeBrowserInitialized() {
        const puppeteerOpts = this.client.options.puppeteer;
        const sessionDirName = this.clientId ? `session-${this.clientId}` : 'session';
        const dirPath = path.join(this.dataPath, sessionDirName);

        if(puppeteerOpts.userDataDir && puppeteerOpts.userDataDir !== dirPath) {
            throw new Error('LocalAuth is not compatible with a user-supplied userDataDir.');
        }

        fs.mkdirSync(dirPath, { recursive: true });

        this.client.options.puppeteer = {
            ...puppeteerOpts,
            userDataDir: dirPath
        };

        this.userDataDir = dirPath;
    }

    async logout() {
      console.log(this.userDataDir);

      // Verifique se o navegador Puppeteer foi completamente fechado
      if (this.client.pupBrowser && this.client.pupBrowser.isConnected()) {
          console.log('Fechando o navegador Puppeteer...');
          await this.client.pupBrowser.close(); // Fecha o navegador para liberar os arquivos
      }

      if (this.userDataDir) {
          await fs.promises.rm(this.userDataDir, { recursive: true, force: true })
              .catch((error) => {
                  console.log("Erro ao remover o diretório:", this.userDataDir);
                  // Lida com o erro sem parar o servidor
                  if (error?.code === 'ENOENT') {
                    console.error(`O arquivo ou diretório '${path}' não existe.`);
                  } else if (error?.code === 'EBUSY') {
                    console.error(`O arquivo ou diretório '${path}' está em uso.`);
                  } else {
                    console.error(`Erro ao remover '${path}':`, error?.message);
                  }
              });
      }
   }
}

export default AlphaxLocalAuth;
