# Argument Mining on the Web

## DataSets

- Argument  pairs  from  debate  platforms  (Debatepedia  and  ProCon): http://www-sop.inria.fr/NoDE/NoDE-xml.html#debatepedia

- Argument   components   and   relations   from   persuasive   essays: https://www.ukp.tu-darmstadt.de/data/argumentation-mining/argument-annotated-essays/

- Argument components from political speeches: http://argumentationmining.disi.unibo.it/aaai2016.html

## TODO

Develop a tool for visualizing these datasets such that:

- For  datasets  annotated  with  argument  components:  you  visualize  with  a different  color  the  different  components  (e.g.,  claims  in  red,  evidences  in green, major claims in blue, ... ).

- For dataset annotated with argument relations: you visualize with a different color the different kinds of relation (e.g., red for attack relations and green for support relations).

- For the NoDE dataset, you should check to avoid replications of the same pair and you need to construct the graph, one for each topic in the dataset. The graph is composed of the pairs contained in the dataset.

- Both  for  intra-and  iter-argument  relations  the  visualization  page  should provide a “short” version of the argument (i.e., you do not visualize the whole textual content of the argument or the argument component, but you provide the first 5 words only, then you complete with [...]). You have to implement also the functionality such that, by clicking on the argument (or argument component), the entire argumentis visualized in a pop-up window.

- Write  a  report  (min.  2  pages – max.  5  pages)  with  all  the  details  about  the implementation and the obtained results.

## Course
