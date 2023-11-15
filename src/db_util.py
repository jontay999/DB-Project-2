from pprint import pprint
import re
EXAMPLE_RESULT1 = [('Sort  (cost=617704.60..620739.96 rows=1214145 width=44)',), ("  Sort Key: (sum((lineitem.l_extendedprice * ('1'::numeric - lineitem.l_discount)))) DESC, orders.o_orderdate",), ('  ->  Finalize GroupAggregate  (cost=260515.66..420302.08 rows=1214145 width=44)',), ('        Group Key: lineitem.l_orderkey, orders.o_orderdate, orders.o_shippriority',), ('        ->  Gather Merge  (cost=260515.66..392477.92 rows=1011788 width=44)',), ('              Workers Planned: 2',), ('              ->  Partial GroupAggregate  (cost=259515.64..274692.46 rows=505894 width=44)',), ('                    Group Key: lineitem.l_orderkey, orders.o_orderdate, orders.o_shippriority',), ('                    ->  Sort  (cost=259515.64..260780.37 rows=505894 width=24)',), ('                          Sort Key: lineitem.l_orderkey, orders.o_orderdate, orders.o_shippriority',), ('                          ->  Nested Loop  (cost=4524.78..201208.53 rows=505894 width=24)',), ('                                ->  Parallel Hash Join  (cost=4524.35..40072.36 rows=126467 width=12)',), ('                                      Hash Cond: (orders.o_custkey = customer.c_custkey)',), ('                                      ->  Parallel Seq Scan on orders  (cost=0.00..33907.50 rows=624938 width=16)',), ("                                            Filter: (o_totalprice > '10'::numeric)",), ('                                      ->  Parallel Hash  (cost=4366.25..4366.25 rows=12648 width=4)',), ('                                            ->  Parallel Seq Scan on customer  (cost=0.00..4366.25 rows=12648 width=4)',), ("                                                  Filter: (c_mktsegment = 'BUILDING'::bpchar)",), ('                                ->  Index Scan using lineitem_pkey on lineitem  (cost=0.43..1.11 rows=16 width=16)',), ('                                      Index Cond: (l_orderkey = orders.o_orderkey)',), ("                                      Filter: (l_extendedprice > '10'::numeric)",)]
EXAMPLE_RESULT2 = [('Sort (actual time=4647.609..4738.741 rows=303959 loops=1)',), ("  Sort Key: (sum((lineitem.l_extendedprice * ('1'::numeric - lineitem.l_discount)))) DESC, orders.o_orderdate",), ('  Sort Method: external merge  Disk: 10120kB',), ('  Buffers: shared hit=1122181 read=160111, temp read=6540 written=6577',), ('  ->  Finalize GroupAggregate (actual time=3996.899..4515.400 rows=303959 loops=1)',), ('        Group Key: lineitem.l_orderkey, orders.o_orderdate, orders.o_shippriority',), ('        Buffers: shared hit=1122178 read=160111, temp read=5275 written=5305',), ('        ->  Gather Merge (actual time=3996.885..4298.647 rows=303959 loops=1)',), ('              Workers Planned: 2',), ('              Workers Launched: 2',), ('              Buffers: shared hit=1122178 read=160111, temp read=5275 written=5305',), ('              ->  Partial GroupAggregate (actual time=3986.508..4239.800 rows=101320 loops=3)',), ('                    Group Key: lineitem.l_orderkey, orders.o_orderdate, orders.o_shippriority',), ('                    Buffers: shared hit=1122178 read=160111, temp read=5275 written=5305',), ('                    ->  Sort (actual time=3986.451..4034.801 rows=404914 loops=3)',), ('                          Sort Key: lineitem.l_orderkey, orders.o_orderdate, orders.o_shippriority',), ('                          Sort Method: external merge  Disk: 14168kB',), ('                          Buffers: shared hit=1122178 read=160111, temp read=5275 written=5305',), ('                          Worker 0:  Sort Method: external merge  Disk: 14088kB',), ('                          Worker 1:  Sort Method: external merge  Disk: 13944kB',), ('                          ->  Nested Loop (actual time=134.464..3766.255 rows=404914 loops=3)',), ('                                Buffers: shared hit=1122148 read=160111',), ('                                ->  Parallel Hash Join (actual time=134.106..420.377 rows=101320 loops=3)',), ('                                      Hash Cond: (orders.o_custkey = customer.c_custkey)',), ('                                      Buffers: shared hit=16 read=29680',), ('                                      ->  Parallel Seq Scan on orders (actual time=0.054..134.439 rows=500000 loops=3)',), ("                                            Filter: (o_totalprice > '10'::numeric)",), ('                                            Buffers: shared read=26095',), ('                                      ->  Parallel Hash (actual time=133.970..133.971 rows=10047 loops=3)',), ('                                            Buckets: 32768  Batches: 1  Memory Usage: 1472kB',), ('                                            Buffers: shared read=3585',), ('                                            ->  Parallel Seq Scan on customer (actual time=0.142..130.876 rows=10047 loops=3)',), ("                                                  Filter: (c_mktsegment = 'BUILDING'::bpchar)",), ('                                                  Rows Removed by Filter: 39953',), ('                                                  Buffers: shared read=3585',), ('                                ->  Index Scan using lineitem_pkey on lineitem (actual time=0.029..0.032 rows=4 loops=303959)',), ('                                      Index Cond: (l_orderkey = orders.o_orderkey)',), ("                                      Filter: (l_extendedprice > '10'::numeric)",), ('                                      Buffers: shared hit=1122132 read=130431',), ('Planning:',), ('  Buffers: shared hit=203 read=50',), ('Planning Time: 10.724 ms',), ('Execution Time: 4761.614 ms',)]
EXAMPLE_RESULT3 = [('Finalize Aggregate  (cost=170000.03..170000.04 rows=1 width=32) (actual time=366.352..369.050 rows=1 loops=1)',), ('  Buffers: shared hit=9379 read=103124',), ('  ->  Gather  (cost=169999.81..170000.02 rows=2 width=32) (actual time=366.277..369.042 rows=3 loops=1)',), ('        Workers Planned: 2',), ('        Workers Launched: 2',), ('        Buffers: shared hit=9379 read=103124',), ('        ->  Partial Aggregate  (cost=168999.81..168999.82 rows=1 width=32) (actual time=362.300..362.301 rows=1 loops=3)',), ('              Buffers: shared hit=9379 read=103124',), ('              ->  Parallel Seq Scan on lineitem  (cost=0.00..168761.63 rows=47635 width=12) (actual time=0.096..351.727 rows=38053 loops=3)',), ("                    Filter: ((l_shipdate >= '1994-01-01'::date) AND (l_shipdate < '1995-01-01 00:00:00'::timestamp without time zone) AND (l_discount >= 0.05) AND (l_discount <= 0.07) AND (l_quantity < '24'::numeric))",), ('                    Rows Removed by Filter: 1962352',), ('                    Buffers: shared hit=9379 read=103124',), ('Planning Time: 0.111 ms',), ('Execution Time: 369.089 ms',)]

# Class for abstract representation of the buffer information used in a node
class Buffer:
    def __init__(self, content):
        content = content.split("Buffers: ")[1]
        self.parse_buffer_content(content)


    def parse_buffer_content(self, content):

        pattern = r"(\w+(?:\s\w+)?)=(\d+)"
        categories = re.findall(pattern, content)
        for i in range(len(categories)):
            category = categories[i][0].replace(' ', '_')
            setattr(self, category, int(categories[i][1]))

        
    def to_json(self):
        return vars(self)

# Class for abstract representation of query execution plan node
class Node:
    def __init__(self, id, primary_content):
        self.id = id
        primary_content = primary_content.split(') (')[0] + ')'
        self.parse_primary_content(primary_content)
        self.secondary_content = []
        self.children = []
        self.secondary_table = None
        
    def parse_primary_content(self, content):
        content = content.strip()[:-1]
        content = content.split('->')[-1]
        title, content = content.split('(')
        if " on " in title:
            table = title.split(" on ")[-1].strip()
            self.table = " as ".join(table.split(" "))
            self.title = title.split(" on ")[0].strip()
        else:
            self.title = title.strip()
            self.table = None
        content = content.strip()
        _, cost_range, rows, width = content.split('=')
        cost_range = cost_range.split(' ')[0].split('..')
        self.cost = (float(cost_range[0]), float(cost_range[1]))
        self.rows = int(rows.split(' ')[0].split(')')[0])
        self.width = int(width.split(' ')[0].split(')')[0])

    def parse_secondary_content(self, content):
        headers = ["Group Key:","Sort Key:","Filter:","Hash Cond:","Index Cond:"]
        to_remove = ["::numeric","::bpchar[]","::bpchar","::date"]
        content = content.lstrip()
        for remove in to_remove:
            content = content.replace(remove,"")

        def get_secondary_table_name(content):
            list_of_words = content.split(" ")
            for word in list_of_words:
                if "." in word:
                    return word.split(".")[0]
                
        for header in headers:     
            if header in content:
                content = content.split(header)[-1].strip()
                if content[0]=='(' and content[-1]==')':
                    content = content[1:-1]
                if header == "Index Cond:":
                    self.secondary_table = get_secondary_table_name(content)
                return content
            
        return content
    
    def add_secondary_content(self, content):
        content = self.parse_secondary_content(content)
        if "Buffer" in content: 
            self.buffer = Buffer(content)
            return
        
        self.secondary_content.append(content)
    
    def add_child(self, node_id):
        self.children.append(node_id)

    def __str__(self, verbose=False):
        if verbose:
            return f'''Node {self.id}, title: {self.title}
                children: {self.children}
                cost: {self.cost}, rows: {self.rows}, width: {self.width}
                content: {self.secondary_content}
                table: {self.table}'''
        return f'Node {self.id}, title: {self.title}, children: {self.children}'
    
    def __repr__(self):
        return self.__str__(False)


    def to_json(self):
        return {
            "id": self.id,
            "children": self.children,
            "cost": self.cost,
            "rows": self.rows,
            "title": self.title,
            "width": self.width,
            "secondary_content": self.secondary_content,
            "table": self.table,
            "secondary_table": self.secondary_table,
            "buffer": self.buffer.to_json()
        }

# Return graph using result of EXPLAIN sql query
def parse_explain(explain_rows):
    explain_rows = [row[0] for row in explain_rows]
    stack = []
    all_nodes = []
    node_id = 0
    graph = {}


    for row in explain_rows:
        if "Planning" in row: break
        indent = len(row) - len(row.lstrip())
        has_arrow = '->' in row
        if has_arrow: node_id += 1
        if node_id not in graph: graph[node_id] = []

        if has_arrow or indent == 0:
            node = Node(node_id, row.lstrip())
            while stack and (stack[-1][0] != 0 and (indent - stack[-1][0] not in  {2,6})):
                stack.pop()
            
            if stack:
                stack[-1][1].add_child(node_id)
            
            stack.append((indent, node))
            all_nodes.append(node)
        else:
            assert len(stack) > 0, "Something went wrong!"
            stack[-1][1].add_secondary_content(row)

    return all_nodes

# Convert adjacency list representation into a nested tree representation
def tree_representation(all_nodes):
    d = all_nodes[0].to_json()
    def dfs(curr_d):
        children_rep = []
        for child in curr_d["children"]:
            next_d = all_nodes[child].to_json()
            result = dfs(next_d)
            children_rep.append(result)
        curr_d["children"] = children_rep
        return curr_d
    return dfs(d)

# Return string representation of tree
def summary_representation(data,depth=0):
    result = ""
    indent = " " * depth
    result += f"#{data['id']+1} {indent} ∟ {data['title']}\n"
    for child in data.get('children', []):
        result += summary_representation(child, depth + 1)
    return result

# Return planning and execution time
def timing_representation(rows):
    return [
        rows[-2][0], rows[-1][0]
    ]
    


if __name__ == "__main__":
    print("Runing db_util!!")
    # note that first item will always be the root
    all_nodes = parse_explain(EXAMPLE_RESULT1)
    res = tree_representation(all_nodes)
    for n in all_nodes:
        pprint(n.to_json())
 