title: Flux de production des études
---
short: Flux de production
---
body
Dans le tableau le terme **étude** désigne indifféremment une [étude](./definition-etude) ou une prestation impactant un des budgets d'études de nos services (AMO, formation, intervention dans un séminaire,...). A chaque étape, le service pilote fourni les éléments soit à son correspondant études, soit à une personne ayant accès à l'outil pour mise à jour.

| période | Monde réel | Avancement de l'étude | Outil de suivi |
| :------ | :--------- | :-------------------: | :------------- |
n'importe quand | Un besoin d'étude est identifié par un service : Il consulte les autres services potentiellement intéressés, et fourni les éléments à son correspondant étude pour saisie dans l'outil | **idée d'étude** |un objet étude est créé dans la base. Champs complétés : `id` (automatique), `date_creation`,... |
n'importe quand | le service pilote élabore une [fiche étude](./fiche-etude) qui comporte notamment une première estimation des moyens nécessaires (et une hypothèse de financement associée) | **projet d'étude** |Champs complétés : `mont_estime`, `ligne_budg`,... |
sept-oct | Dialogue de gestion pour l'année suivante : les services font remonter les besoins priorisés |  |  |
mars | Comité des études du premier trimestre : en fonction des résultats du dialogue de gestion et des possibilités humaines et financières, un programme d'étude est proposé aux directions |  |  |
mars-avril | les directions examinent puis valident un programme d'études. Les études n'ayant pas été retenues peuvent être présentées à nouveau au programme suivant si le besoin existe toujours. | **étude programmée** | Champs complétés : `montant_prog`,... |
suite à la programmation | le service pilote fait établir un devis ou effectue une consultation pour la réalisation de son étude. Sur cette base il passe commande de la prestation. Pour les études en régie, il organise une réunion de lancement réunissant les partenaires | **étude engagée** | Champs complétés `ae_engage`, `m_oeuvre`, `ref_moeuvre` |
pendant la réalisation de l'étude | le service pilote *peut* utiliser l'outil de suivi pour tenir à jour son niveau de dépense et d'avancement |  | Champs complétés : `avanct`, `montant_fact`, `montant_mand` |
à l'issue de la réalisation de l'étude | le service pilote réceptionne et valide la facture puis procède au règlement | **étude terminée** | Champs complétés : `avancement=100%`, `cp_mandate` |
dès que possible après finalisation de l'étude | le service pilote valorise son étude. A minima par un versement au bureau de la documentation. Idéalement par la publication de l'étude et de sa synthèse sur internet. La lettre des études peut également être utilisée.<br>Le bureau de la documentation verse l'étude au catalogue [CIRCE](http://www.etudes-normandie.fr/) et fourni en retour l'identifiant CIRCE de l'étude | **étude valorisée** | Champs complétés : `valorisation`, `url`, puis dès que l'étude a été versée sur CIRCE `circe` |
n'importe quand | à n'importe quel moment dans ce cycle, le service pilote peut constater l'impossibilité ou l'absence d'intérêt de mener l'étude à terme. Il en informe alors son correspondant étude qui le répercute dans l'outil. | **étude abandonnée** | Champs complétés : `abandon=true`, `commentaire` |
