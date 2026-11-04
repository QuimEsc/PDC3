# Diagnòstic segur d'OpenAI

La qualificació oberta, decision/mission/text i la comprovació opcional de correcció utilitzen Apps Script → Responses API. No s'utilitza Assistants API. La pista del segon intent reutilitza el feedback existent i no fa una crida nova. La revisió històrica aplica decisions ja aprovades; obrir-la no invoca el model.

El flux acadèmic actual confirma ANSWER en Firebase, valida identitat/sessió/context i reclama l'enviament abans de demanar la qualificació. Un resultat vàlid crea backendGrade, GRADE i pendingEvent; el worker els projecta a Sheets. El diagnòstic següent prova només la construcció de la petició i el parser reals contra OpenAI; no executa eixa persistència ni autentica la sessió d'un alumne.

## Prova real, sense dades acadèmiques

Amb Node 22 o posterior i `OPENAI_API_KEY` ja carregada privadament en l'entorn:

```powershell
node scripts/verify-openai.mjs --mode all
```

Alternativament, passa `--config-path RUTA_PRIVADA` a un fitxer privat de configuració Apps Script. També es pot indicar eixa ruta amb `PDC_OPENAI_CONFIG`. No poses la clau en la línia de comandament. El fitxer privat determina els models i el flag d'activació; els defaults són `gpt-6-luna`, amb reasoning `medium`. No usa una credencial de la plantilla versionada ni selecciona silenciosament entre claus contradictòries.

El pressupost i l'esquema es construïxen amb les funcions reals de `apps-script/Code.gs`: 1.600 tokens per a qualificació i 450 per a comprovació de correcció. No es canvien ni el prompt ni les rúbriques de producció. `--mode grade` fa una sola petició; `--mode all` en fa dues. No hi ha reintents automàtics. El timeout local és de 60 segons per petició; un timeout no demostra que el servidor no haja consumit tokens.

La resposta torna a passar pel parser del backend. S'imprimixen únicament HTTP real, duració, model, reasoning, tokens, estat i resultat de validació. Els missatges originals de l'API i les credencials no s'imprimixen. `--output FITXER` conserva estes mateixes mètriques, també si un mode falla.

L'entrada antiga continua disponible:

```powershell
./scripts/test-openai-grader.ps1 -ConfigPath RUTA_PRIVADA -Mode all
```

Abans usava un model diferent, 800 tokens, un prompt de prova propi i un lector d'errors de Windows PowerShell incompatible amb PowerShell modern. Ara delega en el diagnòstic anterior i retorna un codi d'eixida no zero si falla. No cal migrar cap API.

## Resultats i límits

Els errors distingixen autenticació (401), accés (403), model/ruta (404), límit de ritme o saldo (429), servidor (5xx), HTTP amb HTML, resposta incompleta, refusada, buida o JSON invàlid. No es reenvia automàticament una petició facturable per corregir estos errors. En el backend, una comprovació de correcció invàlida continua passant pel fallback pedagògic existent; no inventa una nota acadèmica.

El timeout del frontend és 145 s per a qualificació i 90 s per a correcció. UrlFetchApp no exposa un timeout configurable equivalent: un timeout del navegador no cancel·la necessàriament la petició del servidor. Els reintents acadèmics han de conservar el submissionId; els tests existents comproven recuperació i deduplicació. Si el procés mor després de la resposta d'OpenAI però abans de persistir el resultat, no hi ha una garantia absoluta de factura única.

La documentació antiga d'arquitectura del repositori és anterior al flux Firebase-first; per a l'estat operatiu actual preval el checkpoint de `HANDOFF.md` i `PDC3_HANDOFF.md`.

Les dues còpies versionades de `Configuracio.gs` són plantilles. En un desplegament futur autoritzat, conserva la configuració privada real i publica el backend des de l'entorn privat previst; no sobreescrigues la configuració de producció amb estes plantilles ni executes un push directe des del repositori.

## Fonts oficials

- [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create)
- [Reasoning: límit compartit entre tokens de raonament i eixida](https://developers.openai.com/api/docs/guides/reasoning)

HTTP 200 no substituïx la comprovació de `status`: una resposta `incomplete` no és un resultat acadèmic vàlid.
