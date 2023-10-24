EXAMPLE_RESULT = [('Sort  (cost=617704.60..620739.96 rows=1214145 width=44)',), ("  Sort Key: (sum((lineitem.l_extendedprice * ('1'::numeric - lineitem.l_discount)))) DESC, orders.o_orderdate",), ('  ->  Finalize GroupAggregate  (cost=260515.66..420302.08 rows=1214145 width=44)',), ('        Group Key: lineitem.l_orderkey, orders.o_orderdate, orders.o_shippriority',), ('        ->  Gather Merge  (cost=260515.66..392477.92 rows=1011788 width=44)',), ('              Workers Planned: 2',), ('              ->  Partial GroupAggregate  (cost=259515.64..274692.46 rows=505894 width=44)',), ('                    Group Key: lineitem.l_orderkey, orders.o_orderdate, orders.o_shippriority',), ('                    ->  Sort  (cost=259515.64..260780.37 rows=505894 width=24)',), ('                          Sort Key: lineitem.l_orderkey, orders.o_orderdate, orders.o_shippriority',), ('                          ->  Nested Loop  (cost=4524.78..201208.53 rows=505894 width=24)',), ('                                ->  Parallel Hash Join  (cost=4524.35..40072.36 rows=126467 width=12)',), ('                                      Hash Cond: (orders.o_custkey = customer.c_custkey)',), ('                                      ->  Parallel Seq Scan on orders  (cost=0.00..33907.50 rows=624938 width=16)',), ("                                            Filter: (o_totalprice > '10'::numeric)",), ('                                      ->  Parallel Hash  (cost=4366.25..4366.25 rows=12648 width=4)',), ('                                            ->  Parallel Seq Scan on customer  (cost=0.00..4366.25 rows=12648 width=4)',), ("                                                  Filter: (c_mktsegment = 'BUILDING'::bpchar)",), ('                                ->  Index Scan using lineitem_pkey on lineitem  (cost=0.43..1.11 rows=16 width=16)',), ('                                      Index Cond: (l_orderkey = orders.o_orderkey)',), ("                                      Filter: (l_extendedprice > '10'::numeric)",)]

class Node:
    def __init__(self, id, primary_content):
        self.id = id
        self.parse_primary_content(primary_content)
        self.secondary_content = []
        self.children = []
        
    def parse_primary_content(self, content):
        content = content.strip()[:-1]
        content = content.split('->')[-1]
        title, content = content.split('(')
        self.title = title.strip()
        content = content.strip()
        _, cost_range, rows, width = content.split('=')
        cost_range = cost_range.split(' ')[0].split('..')
        self.cost = (float(cost_range[0]), float(cost_range[1]))
        self.rows = int(rows.split(' ')[0])
        self.width = int(width.split(' ')[0])
    
    def add_secondary_content(self, content):
        self.secondary_content.append(content.lstrip())
    
    def add_child(self, node_id):
        self.children.append(node_id)

    def __str__(self, verbose=False):
        if verbose:
            return f'''Node {self.id}, title: {self.title}
                children: {self.children}
                cost: {self.cost}, rows: {self.rows}, width: {self.width}'''
        return f'Node {self.id}, title: {self.title}, children: {self.children}'
    
    def __repr__(self):
        return self.__str__(False)

def parse_explain(explain_rows):
    explain_rows = [row[0] for row in explain_rows]
    stack = []
    all_nodes = []
    node_id = 0
    graph = {}
    for row in explain_rows:
        indent = len(row) - len(row.lstrip())
        has_arrow = '->' in row
        if has_arrow: node_id += 1
        if node_id not in graph: graph[node_id] = []

        if has_arrow or indent == 0:
            node = Node(node_id, row.lstrip())

            while stack and indent - 6 != stack[-1][0]:
                stack.pop()
            
            if stack:  stack[-1][1].add_child(node_id)
            stack.append((indent, node))
            all_nodes.append(node)
        else:
            assert len(stack) > 0, "Something went wrong!"
            stack[-1][1].add_secondary_content(row)
    return all_nodes

all_nodes = parse_explain(EXAMPLE_RESULT)
