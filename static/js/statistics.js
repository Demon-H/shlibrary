var DatatableRemoteAjax = {
    init: function() {
        var t;
        t = $(".m_datatable").mDatatable({
            data: {
                type: "remote",
                source: {
                    read: {
                        url: "/fzstat/",
                        map: function(t) {
                            var e = t;
                            return void 0 !== t.data && (e = t.data),
                            e
                        }
                    }
                },
                pageSize: 10,
                serverPaging: !0,
                serverFiltering: !0,
                serverSorting: !0
            },
            layout: {
                scroll: !1,
                footer: !1
            },
            sortable: !1,
            pagination: !0,
            columns: [
            {
                field: "bookname",
                filterable: !0,
                sortable: !1,
                title: "志书名称",
                template:function(t){
                    return "<a href='/fz_detail/?name="+t.bookname+"&wtime="+t.year_w+"' target='_blank'>"+t.bookname+"</a>";
                }
            },
            {
                field: "year_c",
                filterable: !0,
                sortable: !1,
                title: "版本"
                
            },
            {
                field: "count_wc",
                filterable: !0,
                sortable: !1,
                title: "物产种类"
                
            },
            {
                field: "type",
                filterable: !0,
                sortable: !1,
                title: "志书类型"
            }]
        })
    }
};
jQuery(document).ready(function() {
    DatatableRemoteAjax.init()
});