import { Keypair } from '@solana/web3.js';
import fs from 'mz/fs';
import os from 'os';
import path from 'path';
import yaml from 'yaml';

/**
 * @private
 */
async function getConfig(): Promise<any> {
  // Path to Solana CLI config file
  const CONFIG_FILE_PATH = path.resolve(
    os.homedir(),
    '.config',
    'solana',
    'cli',
    'config.yml',
  );
  const configYml = await fs.readFile(CONFIG_FILE_PATH, { encoding: 'utf8' });
  return yaml.parse(configYml);
}

/**
 * Load and parse the Solana CLI config file to determine which RPC url to use
 */
export async function getRpcUrl(): Promise<string> {
  try {
    const config = await getConfig();
    if (!config.json_rpc_url) throw new Error('Missing RPC URL');
    return config.json_rpc_url;
  } catch (err) {
    console.warn('Failed to read RPC url from CLI config file, falling back to localhost', err);
    return 'http://127.0.0.1:8899';
  }
}

/**
 * Load and parse the Solana CLI config file to determine which payer to use
 */
export async function getPayer(): Promise<Keypair> {
  try {
    const config = await getConfig();
    if (!config.keypair_path) throw new Error('Missing keypair path');
    return await createKeypairFromFile(config.keypair_path);
  } catch (err) {
    console.warn('Failed to create keypair from CLI config file, falling back to new random keypair', err);
    return Keypair.generate();
  }
}

/**
 * Load and parse the Solana CLI config file to determine which payer to use
 */
export async function getPayerByFileName(filename: string): Promise<Keypair> {
  try {
    if (!filename) throw new Error('Missing parameter filename');
    if (!(filename.split('.').slice(-1)[0] == "json")) throw new Error('Filename must end in json');

    const CONFIG_FILE_PATH = path.resolve(
      os.homedir(),
      '.config',
      'solana',
      filename,
    );
    const ifexists = await fs.exists(CONFIG_FILE_PATH);
    if (!ifexists) throw new Error('File ' + CONFIG_FILE_PATH + ' not exists, pls check.');

    return await createKeypairFromFile(CONFIG_FILE_PATH);
  } catch (err) {
    console.warn('Failed to load keypair from Given file, falling back to new random keypair', err);
    return Keypair.generate();
  }
}

/**
 * Create a Keypair from a secret key stored in file as bytes' array
 */
export async function createKeypairFromFile(
  filePath: string,
): Promise<Keypair> {
  const secretKeyString = await fs.readFile(filePath, { encoding: 'utf8' });
  const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
  return Keypair.fromSecretKey(secretKey);
}
