from SPARQLWrapper import SPARQLWrapper, JSON, XML
#https://github.com/RDFLib/sparqlwrapper
#https://rdflib.github.io/sparqlwrapper/

def dbpedia_test():
    sparql = SPARQLWrapper("http://dbpedia.org/sparql")
    sparql.setQuery("""
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        SELECT ?label
        WHERE { <http://dbpedia.org/resource/Asturias> a ?label }
    """)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()

    print(results)

    #for result in results["results"]["bindings"]:
        #print('%s: %s' % (result["label"]["xml:lang"], result["label"]["value"]))

def fzwc_test():
    # https://codeday.me/bug/20171011/83689.html
    sparql = SPARQLWrapper("http://47.97.124.135:8890/sparql")
    sparql.setQuery("""
        SELECT DISTINCT ?property ?hasValue
        WHERE {
            <http://www.fzwc.online/entity/produce/xPKKduH14f7LTkVT> ?property ?hasValue .
        }
        #LIMIT 25
        #OFFSET 0
    """)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()

    print(results)
    #for result in results["results"]["bindings"]:
        #print(f'{result["property"]["value"]} : {result["hasValue"]["value"]}')

def shlib_test():
    sparql = SPARQLWrapper("http://data.library.sh.cn:8890/sparql")
    sparql.setQuery(r"""
        SELECT DISTINCT ?property ?hasValue ?isValueOf
        WHERE {
            { <http://data.library.sh.cn/gj/resource/instance/8hhgh4ku7np2p7d6> ?property ?hasValue }
            UNION
            { ?isValueOf ?property <http://data.library.sh.cn/gj/resource/instance/8hhgh4ku7np2p7d6> }
        }
        #LIMIT 25
        #OFFSET 0
    """)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()
    print(results)

if __name__ == "__main__":
    """SELECT * WHERE { GRAPH <http://www.fzwc.online/ontology> { ?s ?p ?o} } """ # all data in http://www.fzwc.online/ontology graph(database)

    fzwc_test()

""" ecnu fz
select DISTINCT ?p ?o
where {
 <http://fangzhi.ecnu.edu.cn/entity/work/68a72a10ac274986aca1cb30ffb1c02a> ?p ?o .
}


select DISTINCT ?p ?o
where {
 <http://fangzhi.ecnu.edu.cn/entity/work/68a72a10ac274986aca1cb30ffb1c02a> ?p ?o FILTER isBlank(?o) .
}


select *
where {
    {
        select DISTINCT ?p ?o
        where {
            <nodeID://b1044002> ?p ?o .
    }
    } union {
        select DISTINCT ?p ?o
        where {
            <nodeID://b1044001> ?p ?o .
        }
    }
}

https://github.com/openlink/virtuoso-opensource/issues/126


// 递归Blank Node
http://fangzhi.ecnu.edu.cn/entity/work/bc2ac6c1a9bc4094861811d9c87068c2
"""