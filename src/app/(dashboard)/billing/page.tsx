import React from 'react'
import { DashboardPage } from '../_component/dashboardpage'
import Stripewrapper from './stripewrapper'
import PaymentForm from './paymentform'

export default function page() {
  return (
  <DashboardPage title='Billing' 
                titleClassName='md:text-4xl sm:text-2xl'
                hideBackButton={true}>
          <Stripewrapper>
              <PaymentForm />
          </Stripewrapper>   
            </DashboardPage>  )
}
