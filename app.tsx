import React, {useState} from 'react'
import {createRoot} from 'react-dom/client'
import {ChakraProvider,Box,Button,Heading,Text} from '@chakra-ui/react'
import {I18n} from 'react-polyglot'
import {MemoryRouter} from 'react-router-dom'
import {GlobalSearchModal} from '/tmp/shapeshift-11609/src/components/Layout/Header/GlobalSearch/GlobalSearchModal'
import {ModalStackProvider} from '/tmp/shapeshift-11609/src/context/ModalStackProvider'
import {theme} from '/tmp/shapeshift-11609/src/theme/theme'
const App=()=>{const [open,setOpen]=useState(false);return <ChakraProvider theme={theme}><I18n locale='en' messages={{common:{clear:'Clear',close:'Close'}}}><MemoryRouter><ModalStackProvider><Box p={5}><Heading size='md'>Asset search</Heading><Text my={4}>Local component test · simulated results</Text><Button onClick={()=>setOpen(true)}>Open search</Button><GlobalSearchModal isOpen={open} onClose={()=>setOpen(false)} onOpen={()=>setOpen(true)} onToggle={()=>setOpen(x=>!x)}/></Box></ModalStackProvider></MemoryRouter></I18n></ChakraProvider>};createRoot(document.getElementById('root')!).render(<App/>);
