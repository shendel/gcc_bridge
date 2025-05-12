import { useEffect, useState, Component } from "react"
import { useInjectedWeb3 } from '@/web3/InjectedWeb3Provider'
import LoadingPlaceholder from "@/components/LoadingPlaceholder";
import { useNotification } from "@/contexts/NotificationContext";
import { useConfirmationModal } from "@/components/ConfirmationModal";
import AccessDeniedSplash from '@/components/appconfig/AccessDeniedSplash'
import Tabs from "@/components/appconfig/ui/Tabs";
import AdminTabsDeployNew from '@/components/appconfig/AdminTabs/DeployNew'
import AdminTabsMain from '@/components/appconfig/AdminTabs/Main'
import AdminTabsSetupExistsContract from '@/components/appconfig/AdminTabs/SetupExistsContract'

import AdminTabsMenu from '@/components/appconfig/AdminTabs/Menu'
import AdminTabsRouters from '@/components/appconfig/AdminTabs/Routers'
import AdminTabsWhiteLabel from '@/components/appconfig/AdminTabs/WhiteLabel'
import AdminTabsTextBlocks from '@/components/appconfig/AdminTabs/TextBlocks'

import { useStorageProvider } from '@/storage/StorageProvider'
import { useStoragePreloader } from '@/storage/StoragePreloader'

import { GET_CHAIN_BYID } from '@/web3/chains'
import Head from "next/head";

export default function AppConfigSettings(props) {
  const {
    children,
    gotoPage
  } = props
  
  const { openModal } = useConfirmationModal();
  const { addNotification } = useNotification();
  
  const {
    isInstalled,
    //isOwner,
    owner,
    storageIsLoading,
    saveStorage,
    saveExStorage,
    doReloadStorage,
    storageData,
    storageData: {
      uStakeChainId,
      uStakeContract
    }
  } = useStorageProvider()
  const { isOwner } = useStoragePreloader()
  const {
    injectedAccount
  } = useInjectedWeb3()


  const [ activeTab, setActiveTab ] = useState('main')
  
  const adminTabs = [
    { key: "main", title: "Staking contract" },
    { key: "menu", title: "Menu" },
    { key: 'routers', title: 'URL Routers' },
    { key: 'whitelabel', title: 'Whitelabel' },
    { key: 'homepage', title: 'Text blocks' }
  ]

  const handleSaveExStorage = (options) => {
    const {
      message,
      key,
      newData,
    } = options

    openModal({
      description: message,
      onConfirm: () => {
        saveExStorage({
          onBegin: () => {
            addNotification('info', 'Saving app config. Confirm transaction')
          },
          onReady: () => {
            addNotification('success', 'App config successfull saved')
            doReloadStorage()
          },
          onError: () => {
            addNotification('error', 'Fail save app configuration to storage')
          },
          key,
          newData
        })
      }
    })
  }
  const handleSaveStorage = (options) => {
    const {
      message,
      newData,
    } = options

    openModal({
      description: message,
      onConfirm: () => {
        saveStorage({
          onBegin: () => {
            addNotification('info', 'Saving app config. Confirm transaction')
          },
          onReady: () => {
            addNotification('success', 'App config successfull saved')
            doReloadStorage()
          },
          onError: () => {
            addNotification('error', 'Fail save app configuration to storage')
          }, 
          newData
        })
      }
    })
  }
  
  const handleSaveRouters = (newRouters) => {
    console.log('>>> save routers', newRouters)
    openModal({
      description: `Do you really want save new routers configuration?`,
      onConfirm: () => {
        saveStorage({
          onBegin: () => {
            addNotification('info', 'Saving app config. Confirm transaction')
          },
          onReady: () => {
            addNotification('success', 'App config successfull saved')
            doReloadStorage()
          },
          onError: () => {
            addNotification('error', 'Fail save app configuration to storage')
          }, 
          newData: {
            mdRouters: newRouters
          }
        })
      }
    })
  }
  const handleSaveContract = (options) => {
    const {
      stakingChainId,
      stakingContract
    } = options
    const stakingChainInfo = GET_CHAIN_BYID(stakingChainId)
    openModal({
      description: (
        <>
          <div>{`Do you really want to save the staking configuration in the network`}</div>
          <div className="font-bold text-blue-900">{`"${stakingChainInfo.name} (${stakingChainId})`}</div>
          <div>{`Contract address`}</div>
          <div className="font-bold text-blue-900">{`${stakingContract}`}</div>
        </>
      ),
      onConfirm: () => {
        saveStorage({
          onBegin: () => {
            addNotification('info', 'Saving app config. Confirm transaction')
          },
          onReady: () => {
            addNotification('success', 'App config successfull saved')
            doReloadStorage()
          },
          onError: () => {
            addNotification('error', 'Fail save app configuration to storage')
          }, 
          newData: {
            uStakeChainId: stakingChainId,
            uStakeContract: stakingContract
          }
        })
      }
    })
  }
  
  const [ mainSubTab, setMainSubTab ] = useState((uStakeChainId && uStakeContract) ? 'config' : 'deploy')
  
  const mainSubTabs = [
    { key: 'config', title: 'Info' },
    { key: 'deploy', title: 'Deploy new' },
    { key: 'exists', title: 'Setup an exists' }
  ]
  
  if (!isOwner) {
    return (
      <AccessDeniedSplash adminAddress={owner} />
    )
  }
  return (
    <div className="p-6 pt-8">
      <Head>
        <title>uStaking App - Configuration</title>
      </Head>
      <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
        <Tabs
          tabs={adminTabs}
          activeTab={activeTab}
          onTabChanged={(tabKey) => {
            console.log("Active Tab Changed:", tabKey);
            setActiveTab(tabKey);
          }}
        >
          {activeTab == 'main' && (
            <Tabs tabs={mainSubTabs} activeTab={mainSubTab} onTabChanged={(tabKey) => setMainSubTab(tabKey)}>
              {mainSubTab == 'config' && (
                <AdminTabsMain />
              )}
              {mainSubTab == 'deploy' && (
                <AdminTabsDeployNew onSaveContract={handleSaveContract} />
              )}
              {mainSubTab == 'exists' && (
                <AdminTabsSetupExistsContract onSaveContract={handleSaveContract} />
              )}
            </Tabs>
          )}
          {activeTab == 'menu' && (
            <AdminTabsMenu handleSaveStorage={handleSaveStorage} />
          )}
          {activeTab == 'routers' && (
            <AdminTabsRouters onSaveRouters={handleSaveRouters} />
          )}
          {activeTab == 'whitelabel' && (
            <AdminTabsWhiteLabel handleSaveExStorage={handleSaveExStorage} />
          )}
          {activeTab == 'homepage' && (
            <AdminTabsTextBlocks handleSaveExStorage={handleSaveExStorage} />
          )}
        </Tabs>
      </div>
    </div>
  )
}
