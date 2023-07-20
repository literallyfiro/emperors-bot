# /start
start = <b>Ciao! Benvenuto in @EmperorsBot!</b>
        
        👑 <b>Cosa è Emperors?</b>
        Emperors è un bot per far divertire gli utenti del vostro gruppo.
        Scrivendo il nome di un imperatore, i vostri utenti potranno diventare l'imperatore del giorno.
                                    
        ❔ <b>Come funziona?</b>
        Gli amministratori del gruppo avranno il permesso di creare un imperatore (e di rimuoverlo), inserendo una foto e il suo identificativo (che gli utenti dovranno scrivere per diventare l'imperatore del giorno)
                                    
        ⚡️ <b>Quanti imperatori si possono aggiungere in un gruppo?</b>
        La risposta è semplice. Infiniti :P
        Sbizzarritevi a creare i vostri imperatori senza nessun tipo di limite!

# Command /newking
emperors-add-success = 👑  ➥ Complimenti, l'imperatore <code>{ $name }</code> è ora disponibile a tutti gli utenti!
emperors-add-already-exists = ❗️ L'Imperatore { $name } è già sul trono.
emperors-add-no-name = ❗️ Senza nome, senza trono! Per favore, fornisci un nome per l'Imperatore che desideri aggiungere.
failed-to-add-emperor = ⚠️ Impossibile aggiungere l'Imperatore { $name } al gruppo! I destini hanno cospirato contro di noi. Riprova più tardi.
emperors-add-file-too-big = ❗️ Il file che hai inviato è troppo grande! Per favore, invia un file più piccolo (max 2MB).

# Command /removeking
king-remove-does-not-exist = ❌ L'Imperatore { $name } non esiste!
king-remove-removed = ⚔️ L'Imperatore { $name } è stato rimosso!

# Command /listkings (attualmente non è possibile modificare lo stile dell'elenco)
list-no-emperors = 🏰 Non ci sono Imperatori in questo regno!
list-emperors = 👑 <b>Imperatori in questo regno:</b>

# Action to conquer the king
conquered = ||• <b>Congratulazioni</b> { $conqueror } •||
            
            ⚔️ Sei il nuovo imperatore <code>{ $name }</code> di oggi! <i>Il regno gioisce per la nascita di un nuovo conquistatore.</i> 🎉🏰
already-conquered = ⚠️ { $name } è già caduto per mano di { $conqueror }!
already-conquered-by-you = ❗️ Hai già rivendicato la vittoria su { $name }!