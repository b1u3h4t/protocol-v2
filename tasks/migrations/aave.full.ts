import {task} from '@nomiclabs/buidler/config';
import {checkVerification} from '../../helpers/etherscan-verification';
import {ConfigNames} from '../../helpers/configuration';
import {EthereumNetworkNames} from '../../helpers/types';
import {printContracts} from '../../helpers/misc-utils';

task('aave:full', 'Deploy development enviroment')
  .addFlag('verify', 'Verify contracts at Etherscan')
  .setAction(async ({verify}, localBRE) => {
    const POOL_NAME = ConfigNames.Aave;
    const network = <EthereumNetworkNames>localBRE.network.name;

    await localBRE.run('set-bre');

    // Prevent loss of gas verifying all the needed ENVs for Etherscan verification
    if (verify) {
      checkVerification();
    }

    console.log('Migration started\n');

    console.log('1. Deploy address provider');
    await localBRE.run('full:deploy-address-provider', {verify, pool: POOL_NAME});

    console.log('2. Deploy lending pool');
    await localBRE.run('full:deploy-lending-pool', {verify});

    console.log('3. Initialize lending pool');
    await localBRE.run('full:initialize-lending-pool', {verify, pool: POOL_NAME});

    console.log('\nFinished migrations');
    printContracts();
  });
